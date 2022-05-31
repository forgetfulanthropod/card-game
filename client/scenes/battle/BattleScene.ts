// import CaveVideo from '@battleAssets/backgrounds/matcha-cave.webm'
import { datum } from 'datums'
import type { CharacterUid } from 'shared'
import { Cards } from './cards'
import { Characters } from './character'
import { Energy } from './Energy'
import { InfoBox } from './InfoBox'
import { CardAdder } from './cards/CardAdder'
import { Background } from '@/scenes'
import { Container } from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { getBattleScene } from '@/data'

export function BattleScene(): PixiContainer {
    const hoveredCardUid = datum<CharacterUid | null>(null)

    const scene = getBattleScene()

    const dungeonName = scene.get('dungeonName')

    /** NOTE: name is used for lookup */
    const intentArrowContainer = Container({ name: 'IntentArrowsContainer' })
    const container = Container({
        name: 'BattleScene',
        children: [
            Background({ scale: 1, srcs: ['Skelepit Dungeon'] }),
            InfoBox({
                info: [
                    `Room ${scene.get('roomsPassed') + 1}`,
                    scene.get('dungeonName'),
                ],
            }),
            intentArrowContainer,
            Characters(scene),
            Cards({ scene, hoveredCardUid }),
            Energy({ scene }),
            CardAdder(),
        ],
    })

    return container
}
