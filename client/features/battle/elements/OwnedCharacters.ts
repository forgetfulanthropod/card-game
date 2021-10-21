
import { addSelected } from '@/actions'
import { getEntryScene, getOwnedCharacters } from '@/data/rootTree'
// import { OwnedCharacter } from '@/data/types'
import { vals } from '@/util'
import { dataOf } from '@/util/pixiUtils'

import type { PixiContainer } from './mypixi'
import { Container, Sprite, Text } from './mypixi'


export function OwnedCharacters(): PixiContainer {
    const selectedCharacters = getEntryScene().select('selectedCharacters')

    selectedCharacters.on('update', () => {
        characters.forEach(characterContainer => {
            if (characterContainer.children.length > 1)
                characterContainer.removeChildren(1)
        })
        selectedCharacters.get()?.map(c => {
            const indexOfOwned = vals(getOwnedCharacters().get()).findIndex(oc => c.uid === oc.uid)
            characters[indexOfOwned].addChild(
                Sprite({
                    src: dataOf('check'),
                    width: 50,
                    height: 50,
                })
            )
        })
    })

    const characters = vals(getOwnedCharacters().get()).map((c, i) =>
        Container({
            x: i % 5 * 110,
            y: Math.floor(i / 5) * 150,
            children: [
                Sprite({
                    src: dataOf(c.name),
                    scale: .45,
                    onClick: () => addSelected({ character: c }),
                })
            ],
        })
    )

    const hoverTexts = vals(getOwnedCharacters().get()).map((c, _i) => {
        return Text({
            text: `${c.points}`,
            anchor: [0, 0],
            y: 5,
            style: {
                fontFamily: 'VT323',
                fontSize: 60,
                fill: '#fff',
                stroke: '#333',
                strokeThickness: 5,
            },
        })
    })

    characters.forEach((c, i) => c.children[0].on('mouseover', () => {
        c.addChild(hoverTexts[i])
    }))
    characters.forEach((c, i) => c.children[0].on('mouseout', () => {
        c.removeChild(hoverTexts[i])
    }))

    const root = Container({
        x: 200,
        y: -200,
        children: characters
    })


    return root
}
