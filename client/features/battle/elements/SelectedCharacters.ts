import { getEntryScene } from '@/data/rootTree'
import { dataOf } from '@/util/pixiUtils'

import type { PixiContainer } from './mypixi'
import { Container, Sprite } from './mypixi'


const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080

export function SelectedCharacters(): PixiContainer {
    const selectedCharacters = getEntryScene().select('selectedCharacters')

    selectedCharacters.on('update', () => {
        setSelectedCharacters()
    })

    function setSelectedCharacters() {

        const characters = selectedCharacters.get()?.map((c, i) =>
            Container({
                x: Math.ceil(i / 2) * 200 * (i % 2 > 0 ? 1 : -1),
                y: 0,
                children: [
                    Sprite({
                        anchor: [.5, .5],
                        src: dataOf(c.name),
                        scale: 1,
                    }),
                ],
            })
        ) ?? []
        root.removeChildren()
        if (characters.length > 0) root.addChild(...characters)
    }


    const root = Container({
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT * .65,
        children: [],
    })

    setSelectedCharacters()

    return root
}
