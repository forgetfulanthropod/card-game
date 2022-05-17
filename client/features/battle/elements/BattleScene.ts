import { callApi } from '@/actions'
import { getBattleScene } from '@/data/rootTree'
import Coin from '@/elements/Coin'
import type { PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'

import CaveVideo from '../assets/backgrounds/matcha-cave.webm'
import { backgroundAssets } from '../logic/backgroundAssets'
import background from './background'
import { bindCharacters } from './bindCharacters'
import { bindDoors } from './bindDoors'
import { bindEnergy } from './bindEnergy'
import { bindCards } from './cards/bindCards'
import InfoBox from './InfoBox'

export function BattleScene(): PixiContainer {
    const scene = getBattleScene()

    const dungeonName = scene.get('dungeonName')

    const backgroundArgs =
        dungeonName === 'The Matcha Caves'
            ? { src: CaveVideo }
            : { srcs: [backgroundAssets[dungeonName]] }
    const charactersContainer = Container({ name: 'CharactersContainer' })
    const cardsContainer = Container({ name: 'CardsContainer' })
    const energyContainer = Container({ name: 'EnergyContainer' })

    const container = Container({
        name: 'BattleScene',
        children: [
            background({ scale: 1, ...backgroundArgs }),
            InfoBox({
                info: [
                    `Room ${scene.get('roomsPassed') + 1}`,
                    scene.get('dungeonName'),
                ],
            }),
            Coin(),
            charactersContainer,
            cardsContainer,
            energyContainer,
        ],
    })

    bindCharacters(scene, charactersContainer)
    bindCards({ scene, container: cardsContainer })
    bindEnergy({ scene, container: energyContainer })

    setTimeout(() => bindDoors(container), 0)
    setTimeout(() => callApi('StartBattle', {}), 0)

    return container
}
