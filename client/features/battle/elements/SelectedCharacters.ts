import { getEntryScene } from '@/data/rootTree'
import { vals } from '@/util'
import { dataOf } from '@/util/pixiUtils'
import { BASE_HEIGHT, BASE_WIDTH } from '@@/db/battle/constants'
import { Container, PixiContainer, Sprite } from './mypixi'

export function SelectedCharacters(): PixiContainer {
    const selectedCharacters = getEntryScene().select('selectedCharacters')

    selectedCharacters.on('update', () => {
        setSelectedCharacters()
    })

    function setSelectedCharacters() {
        const characters = selectedCharacters.get().map((c, i) =>
            Container({
                x: Math.ceil(i / 2) * 200 * (i % 2 > 0 ? 1 : -1),
                y: 0,
                children: [
                    Sprite({
                        anchor: [.5, .5],
                        src: dataOf(c.name),
                        scale: 1,
                    })
                ],
            })
        )
        root.removeChildren()
        if (characters.length > 0) root.addChild(...characters)
    }


    const root = Container({
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT * .65,
        children: []
    })

    setSelectedCharacters()

    return root
}
