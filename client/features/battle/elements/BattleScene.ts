import { chooseDoor, exitDungeon, startBattle } from '@/actions'
import { getBattleScene } from '@/data/rootTree'
import Coin from '@/elements/Coin'
import type { PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'

import CaveVideo from '../assets/backgrounds/matcha-cave.webm'
import { backgrounds } from '../logic/AssetLoader'
import background from './background'
import { bindCharacters } from './bindCharacters'
import { bindEnergy } from './bindEnergy'
import { bindCards } from './cards/bindCards'
import Doors from './Doors'
import InfoBox from './InfoBox'

export function BattleScene(): PixiContainer {
    const scene = getBattleScene()

    const dungeonName = scene.get('dungeonName')

    const backgroundArgs =
        dungeonName === 'The Matcha Caves'
            ? { src: CaveVideo }
            : { srcs: [backgrounds[dungeonName]] }
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

    setTimeout(() => makeDoors(container), 0)
    setTimeout(() => startBattle(), 0)

    return container
}

function makeDoors(parent: PixiContainer) {
    const doorCursor = getBattleScene().select('doors')
    let doorsContainer: PixiContainer | null = null
    update()
    doorCursor.on('update', update)

    function update() {
        const doors = doorCursor.get()
        // console.log('doors update...')
        if (
            (doors == null || doors.options.length === 0) &&
            doorsContainer != null
        ) {
            parent.removeChild(doorsContainer)
            doorsContainer.destroy()
            doorsContainer = null
        } else if (doors != null) {
            // console.log('adding some doors')
            doorsContainer = Doors({
                callbacks: doors.options.map(
                    d => () => chooseDoor({ door: d })
                ),
                descriptions: doors.descriptions,
                exit: () => exitDungeon(),
            })
            parent.addChild(doorsContainer)
        }
    }
}
