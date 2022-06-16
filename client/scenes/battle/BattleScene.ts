// import CaveVideo from '@battleAssets/backgrounds/matcha-cave.webm'
import { datum } from 'datums'
import type { CharacterUid } from 'shared'
import { Cards, CardAdder } from './cards'
import { Characters } from './character'
import { Energy } from './Energy'
import { BattleRoomInfo } from './BattleRoomInfo'
import { Background } from '@/scenes'
import { Container, If } from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { toDatum } from '@/util'

export function BattleScene(): PixiContainer {
    const hoveredCardUid = datum<CharacterUid | null>(null)

    const scene = getBattleScene()

    /** NOTE: name is used for lookup */
    const intentArrowContainer = Container({ name: 'IntentArrowsContainer' })
    const container = Container({
        name: 'BattleScene',
        children: [
            Background({ scale: 1, srcs: ['Skelepit Dungeon'] }),
            BattleRoomInfo({
                info: [
                    `Room ${scene.get('numRoomsPassed') + 1}`,
                    scene.get('dungeonName'),
                ],
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
    })

    return container
}
