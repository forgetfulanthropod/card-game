import { dataOf } from '@/util/pixiUtils'
import { Container, PixiContainer, Sprite } from './mypixi'
import { OwnedCharacters } from './OwnedCharacters'


export function GameMenuItem(noun: 'characters' | 'items' | 'materials', index: number): PixiContainer {

    const nounMap = {
        characters: 'swordShield',
        items: 'potion',
        materials: 'fishstick',
    } as const

    type Keys = keyof typeof nounMap
    type Values = typeof nounMap[Keys]
    const nounSrc = dataOf(nounMap[noun] as Values)

    const onClick = () => {
        root.addChild(OwnedCharacters())
    }

    const root = Container({
        y: (index - 1) * 150,
        children: [
            Sprite({ onClick, src: nounSrc, width: 150, height: 150, anchor: [0, .5] }),
        ]
    })

    return root
}
