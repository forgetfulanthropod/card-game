import { getEntryScene } from '@/data/rootTree'
import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, dataOf, Sprite } from '@/elementsUtil'


export function SelectedCharacters(): PixiContainer {
    const selectedCharacters = getEntryScene().select('selectedCharacters')

    selectedCharacters.on('update', e => {
        if (e.data.currentData != null) setSelectedCharacters()
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
                    }),
                ],
            })
        ) ?? []
        root.removeChildren()
        // @ts-ignore
        if (Array.isArray(characters) && characters.length > 0) root.addChild(...characters)
    }


    const root = Container({
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT * .65,
        children: [],
    })

    setSelectedCharacters()

    return root
}
