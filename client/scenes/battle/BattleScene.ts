// import CaveVideo from '@battleAssets/backgrounds/matcha-cave.webm'
import { datum } from 'datums'
import type { CharacterUid, PileId, RequiredAction } from 'shared'
import { sampleSize } from 'lodash'
import { Cards, CardAdder } from './cards'
import { Characters } from './character'
import { Energy } from './Energy'
import { BattleRoomInfo } from './BattleRoomInfo'
import { Background } from '@/scenes'
import { Container, If } from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { onUpdate, toDatum } from '@/util'
import { callApi } from '@/callApi'

export function BattleScene(): PixiContainer {
    const hoveredCardUid = datum<CharacterUid | null>(null)

    const scene = getBattleScene()

    /** NOTE: name is used for lookup */
    const intentArrowContainer = Container({ name: 'IntentArrowsContainer' })
    return Container({
        name: 'BattleScene',
        children: [
            Background({ scale: 1, srcs: ['Skelepit Dungeon'] }),
            BattleRoomInfo({
                info: [`room ${scene.get('numRoomsPassed') + 1}`],
            }),
            intentArrowContainer,
            Characters(scene),
            Cards({ scene, hoveredCardUid }),
            Energy({ scene }),
            If(
                toDatum(
                    scene.select('state'),
                    state => state === 'choosing cards'
                ),
                () => CardAdder()
            ),
        ],
        onDestroy: [
            onUpdate(
                scene.select('requireAction'),
                immediatelyTakeRequiredAction,
                true
            ),
        ],
    })
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
