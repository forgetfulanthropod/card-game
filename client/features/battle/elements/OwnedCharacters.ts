import { ownedCharacters } from '@/data/rootTree'
// import { OwnedCharacter } from '@/data/types'
import { vals } from '@/util'
import { dataOf } from '@/util/pixiUtils'
import { addSelected } from '@@/logic/functions'
import { Container, PixiContainer, Sprite } from './mypixi'

export function OwnedCharacters(): PixiContainer {

    // \ = [
    //     { type: 'frogKnight' },
    //     { type: 'gnomeHooligan' },
    // ]
    // const selected: OwnedCharacter[] = []



    const root = Container({
        // y: (index - 1) * 150,
        x: 200,
        children: [
            ...vals(ownedCharacters.get()).map((c, i) => Sprite({
                x: i * 200,
                src: dataOf(c.name),
                onClick: () => addSelected(c),
            }))
        ]
    })


    return root
}
