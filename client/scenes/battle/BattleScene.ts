import { datum, compose, Datum } from 'datums'
import type {
    BattleCursor,
    BattleScene,
    CardUid,
    CharacterUid,
    PileId,
    RequiredAction,
} from 'shared'
import { sampleSize } from 'lodash'
import { Cards, CardAdder, BattleSceneCharacterInfo } from '@sharedElements'
import { keys } from 'shared/code'
import { Characters } from './character'
import { Energy } from './Energy'
import { BattleRoomInfo } from './BattleRoomInfo'
import { HexMapOverlay } from './HexMapOverlay'
import { LootCollector } from './LootCollector'
import { RestSiteOverlay } from './RestSiteOverlay'
import { Background } from '@/scenes'
import { Container, DisplayObject, If, loopSong } from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { onUpdate, toDatum, waitForDeathAnimationsDatum } from '@/util'
import { callApi } from '@/callApi'
import { EndOfRunScreen } from './EndOfRunScreen'
import { ROCursor } from 'sbaobab'

export function BattleSceneEl(): PixiContainer {
    const hoveredCardUid = datum<CardUid | null>(null)

    const scene = getBattleScene()

    /** NOTE: name is used for lookup */
    const intentArrowContainer = Container({ name: 'IntentArrowsContainer' })

    const root = Container(
        {
            name: 'BattleScene',
            onDestroy: [
                onUpdate(
                    scene.select('requireAction'),
                    immediatelyTakeRequiredAction,
                    true
                ),
            ],
        },
        Background({ scale: 1, srcs: ['Skelepit Dungeon'] }),
        intentArrowContainer,
        If(
            toDatum(scene.select('isInMap'), is => !is),
            () => CoreScene(scene, hoveredCardUid)
        ),
        If(
            toDatum(scene.select('isInMap'), is => is),
            () => HexMapOverlay()
        ),
        If(
            toDatum(scene.select('isInRestSite'), is => is),
            () => RestSiteOverlay()
        )
    )

    let battleRoomInfo: null | PixiContainer
    root.on(
        'destroyed',
        onUpdate(
            scene.select('numRoomsPassed'),
            num => {
                if (battleRoomInfo) root.removeChild(battleRoomInfo)
                battleRoomInfo = BattleRoomInfo({
                    info: [
                        num == null || num === -1
                            ? ''
                            : `${num} room${num === 1 ? '' : 's'} cleared`,
                    ],
                })
                root.addChild(battleRoomInfo)
            },
            true
        )
    )

    return root
}

function CoreScene(
    scene: ROCursor<BattleScene>,
    hoveredCardUid: Datum<CardUid | null>
): DisplayObject {
    loopSong('battleMusicHooligansBluff')

    return Container(
        {},
        Characters(scene),
        Cards({ scene, hoveredCardUid }),
        Energy({ scene }),
        BattleSceneCharacterInfo(),
        If(
            compose(
                ([waitForDeathAnimations, sceneState]) =>
                    !keys(waitForDeathAnimations).length &&
                    [
                        'choosing cards',
                        'collecting loot',
                        'won',
                        'lost',
                    ].includes(sceneState) &&
                    sceneState,
                waitForDeathAnimationsDatum,
                toDatum(scene.select('state'), state => state)
            ),
            sceneState =>
                sceneState === 'collecting loot'
                    ? LootCollector()
                    : sceneState === 'choosing cards'
                    ? CardAdder()
                    : sceneState === 'won' || sceneState === 'lost'
                    ? EndOfRunScreen()
                    : Container({})
        )
    )
}

function immediatelyTakeRequiredAction(req: RequiredAction | null) {
    if (req == null) return
    const { type, least } = req
    const toPile = {
        discardHand: 'hand',
        discardDraw: 'draw',
        removeRoom: 'draw',
    } as const
    const pileId: PileId = toPile[type]

    const cardUids = sampleSize(
        Object.keys(getBattleScene().get('cards', pileId)),
        least
    )
    void callApi('finishCard', { cardUids })
}
