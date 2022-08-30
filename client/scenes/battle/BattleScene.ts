import { datum, compose } from 'datums'
import type { CharacterUid, PileId, RequiredAction } from 'shared'
import { sampleSize } from 'lodash'
import { Cards, CardAdder, BattleSceneCharacterInfo } from '@sharedElements'
import { keys } from 'shared/code'
import { Characters } from './character'
import { Energy } from './Energy'
import { BattleRoomInfo } from './BattleRoomInfo'
import { HexMapOverlay } from './HexMapOverlay'
import { LootCollector } from './LootCollector'
import { Background } from '@/scenes'
import { Container, If } from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { onUpdate, toDatum, waitForDeathAnimationsDatum } from '@/util'
import { callApi } from '@/callApi'

export function BattleScene(): PixiContainer {
    const hoveredCardUid = datum<CharacterUid | null>(null)

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
            () =>
                Container(
                    {},
                    Characters(scene),
                    Cards({ scene, hoveredCardUid }),
                    Energy({ scene }),
                    BattleSceneCharacterInfo(),
                    If(
                        compose(
                            ([waitForDeathAnimations, sceneState]) =>
                                !keys(waitForDeathAnimations).length &&
                                ['choosing cards', 'collecting loot'].includes(
                                    sceneState
                                ) &&
                                sceneState,
                            waitForDeathAnimationsDatum,
                            toDatum(scene.select('state'), state => state)
                        ),
                        sceneState =>
                            sceneState === 'collecting loot'
                                ? LootCollector()
                                : CardAdder()
                    )
                )
        ),
        If(
            toDatum(scene.select('isInMap'), is => is),
            () => HexMapOverlay()
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
                        num == null
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
