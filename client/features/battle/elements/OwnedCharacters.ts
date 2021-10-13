import { MyCursor } from '@/config/myBaobab'
import { ownedCharacters, scene } from '@/data/rootTree'
// import { OwnedCharacter } from '@/data/types'
import { vals } from '@/util'
import { dataOf } from '@/util/pixiUtils'
import { EntryState } from '@@/db/entry/types'
import { addSelected } from '@@/logic/functions'
import { Container, PixiContainer, Sprite } from './mypixi'

export function OwnedCharacters(): PixiContainer {
    const selectedCharacters = (scene as MyCursor<EntryState>).select('selectedCharacters')

    selectedCharacters.on('update', () => {
        characters.forEach(characterContainer => {
            if (characterContainer.children.length > 1)
                characterContainer.removeChildren(1)
        })
        selectedCharacters.get().map(c => {
            const indexOfOwned = vals(ownedCharacters.get()).findIndex(oc => c.uid === oc.uid)
            characters[indexOfOwned].addChild(
                Sprite({
                    src: dataOf('check'),
                    width: 50,
                    height: 50,
                })
            )
        })
    })

    const characters = vals(ownedCharacters.get()).map((c, i) =>
        Container({
            x: i % 5 * 100,
            y: Math.floor(i / 5) * 100,
            children: [
                Sprite({
                    src: dataOf(c.name),
                    scale: .4,
                    onClick: () => addSelected(c),
                })
            ]
        })
    )

    const root = Container({
        x: 200,
        children: characters
    })


    return root
}
