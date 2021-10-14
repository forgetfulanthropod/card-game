import { dataOf } from '@/util/pixiUtils'
import { Container, PixiContainer, Sprite } from './mypixi'
import { OwnedCharacters } from './OwnedCharacters'


export function GameMenuItem(noun: 'characters' | 'items' | 'materials', index: number): PixiContainer {

    const nounMap = {
        characters: 'swordShield',
        items: 'potion',
        materials: 'fishstick',
    } as const

    const nounSrc = dataOf(nounMap[noun] as typeof nounMap[(keyof typeof nounMap)])

    const ownedCharacters = OwnedCharacters()
    const onClick = () => {
        if (noun === 'characters' && root.removeChild(ownedCharacters) == null) {
            root.addChild(ownedCharacters)
        }
    }

    const root = Container({
        y: (index - 1) * 150,
        children: [
            Sprite({ onClick, src: nounSrc, width: 150, height: 150, anchor: [0, .5] }),
        ]
    })

    return root
}
