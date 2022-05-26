import CaveVideo from '@battleAssets/backgrounds/matcha-cave.webm'
import { datum } from 'datums'
import type { CharacterUid } from 'shared'
import { bindEnergy } from './bindEnergy'
import { bindCards } from './cards'
import { InfoBox } from './InfoBox'
import { StartRoomButton } from './StartRoomButton'
import { Characters } from './character'
import { Background, backgroundAssets } from '@/scenes'
import { Container, onDestroyed } from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { callApi } from '@/actions'

export function BattleScene(): PixiContainer {
    const hoveredCardUid = datum<CharacterUid | null>(null)

    const scene = getBattleScene()

    const dungeonName = scene.get('dungeonName')

    const backgroundArgs =
        dungeonName === 'The Matcha Caves'
            ? { src: CaveVideo }
            : { srcs: [backgroundAssets[dungeonName]] }
    const intentArrowContainer = Container({ name: 'IntentArrowsContainer' })
    const cardsContainer = Container({ name: 'CardsContainer' })
    const energyContainer = Container({ name: 'EnergyContainer' })

    const container = Container({
        name: 'BattleScene',
        children: [
            Background({ scale: 1, ...backgroundArgs }),
            InfoBox({
                info: [
                    `Room ${scene.get('roomsPassed') + 1}`,
                    scene.get('dungeonName'),
                ],
            }),
            intentArrowContainer,
            Characters(scene),
            cardsContainer,
            energyContainer,
            StartRoomButton(),
        ],
    })

    onDestroyed(
        container,
        bindCards({ scene, container: cardsContainer, hoveredCardUid }),
        bindEnergy({ scene, container: energyContainer })
    )

    setTimeout(() => callApi('StartBattle', {}), 0)

    return container
}
