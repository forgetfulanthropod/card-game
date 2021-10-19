import { dataOf } from '@/util/pixiUtils'

import type { PixiContainer } from './mypixi'
import { Text } from './mypixi'
import { Container, Sprite } from './mypixi'

const doorWidth = 335

export default function Doors(args: { callbacks: Callback[], descriptions?: string[] }): PixiContainer {
    return Container({
        children: args.callbacks.flatMap((cb, i) => [
            Door({ xScaled: i * 1.5 + 1, onClick: cb }),
            args?.descriptions?.[i] != null && Text({ text: args.descriptions[i], x: (i * 1.5 + 1) * doorWidth }),
        ])
    })
}

function Door(args: { xScaled: number, onClick: Callback }) {
    const texture = dataOf('door')
    const x = texture.width * args.xScaled
    return Sprite({
        x,
        src: texture,
        onClick: args.onClick
    })
}

export function DoorsStories(name: 'alert' | 'log'): ReturnType<typeof Doors> {
    return {
        alert: () => Doors({
            callbacks: [
                () => alert('door 1'),
                () => alert('door 2')]
        }),
        log: () => Doors({
            callbacks: [
                () => console.log('door 1'),
                () => console.log('door 2'),
                () => console.log('door 3'),
                () => console.log('door 4')]
        }),
    }[name]()
}
