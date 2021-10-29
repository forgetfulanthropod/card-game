import type { PixiContainer } from '@/elementsUtil/mypixi'
import { Container, Sprite } from '@/elementsUtil/mypixi'
import { dataOf } from '@/elementsUtil/pixiUtils'

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
        children: [Sprite({ onClick, src: nounSrc, scale: .5, x: 20, anchor: [0, .5] })],
    })

    return root
}
