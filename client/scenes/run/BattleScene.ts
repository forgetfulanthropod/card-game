import { collectData } from '@/analytics/collectData'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    DisplayObject,
    If,
    loopSong,
    SpineAsset,
    Sprite,
    Text,
} from '@/elementsUtil'
import { toDatum, waitForDeathAnimationsDatum } from '@/util'
import {
    BattleSceneCharacterInfo,
    CardAdder,
    Cards,
    ConfirmButton,
    EndTurnButton,
} from '@sharedElements'
import { compose, datum, Datum } from 'datums'
import { sampleSize } from 'lodash'
import { Texture } from 'pixi.js'
import { ROCursor } from 'sbaobab'
import { BattleScene, CardUid, PileId, RequiredAction } from 'shared'
import { keys } from 'shared/code'
import { SpineBackground } from '../background'
import { Characters } from './character'
import { EndOfRoom } from './EndOfRoom'
import { EndOfRun } from './EndOfRun'
import { Energy } from './Energy'

const allSrcs: SpineAsset[][] = [
    ['hooligansBluffBg1_0', 'hooligansBluffBg1_1'],
    ['hooligansBluffBg2_0', 'hooligansBluffBg2_1'],
    ['hooligansBluffBg3_0'],
]

export const toDiscardUids = datum([] as CardUid[])
export function BattleScene(
    scene: ROCursor<BattleScene>,
    hoveredCardUid: Datum<CardUid | null>
): DisplayObject {
    playLoopingMusic(scene)
    collectData('ui_ux_view', { page_title: 'Battle Scene' })
    collectData('level_start', {
        room_number: scene.get('numRoomsPassed') + 1,
        room_id: scene.get('currentRoom').uid,
        room_tier: scene.get('currentRoom').category,
        run_id: scene.get('runId'),
    })

    const sceneIndex = Math.abs(scene.get('numRoomsPassed') % allSrcs.length)

    return Container(
        {},
        SpineBackground({ srcs: allSrcs[sceneIndex] }),
        Container({ name: 'NpcIntentArrowContainer' }),
        Characters(scene),
        Energy({ scene }),
        EndTurnButton(),
        BattleSceneCharacterInfo(),
        If(
            toDatum(scene.select('numRequiredToDiscard'), num => num, {
                allowUndefined: true, // edge case for graceful fail with old gamestate..
            }),
            numRequiredToDiscard => {
                if (numRequiredToDiscard === 0) return Container({})

                return Container(
                    {},
                    Sprite({
                        src: Texture.WHITE,
                        tint: 0,
                        width: BASE_WIDTH,
                        height: BASE_HEIGHT,
                        alpha: 0.7,
                        events: { pointerover() {} },
                        defaultCursor: true,
                    }),
                    Text({
                        text: `Choose ${numRequiredToDiscard} cards to discard`,
                        x: BASE_WIDTH / 2,
                        y: BASE_HEIGHT * 0.125,
                        anchor: 0.5,
                        style: {
                            fontFamily: 'bigFont',
                            fontSize: 50,
                            fill: 0xffffff,
                        },
                    }),
                    If(
                        compose(
                            ([uids]) => uids.length === numRequiredToDiscard,
                            toDiscardUids
                        ),
                        () => {
                            return ConfirmButton(() =>
                                callApi('discard', {
                                    cardUids: toDiscardUids.val,
                                })
                            )
                        }
                    )
                )
            }
        ),
        Cards({ scene, hoveredCardUid, toDiscardUids }),
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
                    ? EndOfRoom()
                    : sceneState === 'choosing cards'
                    ? CardAdder()
                    : sceneState === 'won' || sceneState === 'lost'
                    ? EndOfRun()
                    : Container({})
        )
    )
}
function playLoopingMusic(scene: ROCursor<BattleScene>) {
    const category = scene.get('currentRoom', 'category')
    if (category === 'tierOne' || 'events')
        loopSong('battleMusicHooligansBluffTierOne')
    else if (category === 'tierTwo')
        loopSong('battleMusicHooligansBluffTierTwo')
    else if (category === 'tierThree')
        loopSong('battleMusicHooligansBluffTierThreeAndFour')
    else if (category === 'tierFour')
        loopSong('battleMusicHooligansBluffTierThreeAndFour')
    else if (category === 'bosses') loopSong('bossBattleMusicHooligansBluff')
}
export function immediatelyTakeRequiredAction(req: RequiredAction | null) {
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
