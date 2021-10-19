import PlainButton from '@/elements/PlainButton'
import { dataOf } from '@/util/pixiUtils'

import type { PixiContainer } from './mypixi'
import { Text } from './mypixi'
import { Container, Sprite } from './mypixi'

const doorWidth = 335

export default function Doors(args: { callbacks: Callback[], descriptions?: string[], exit: Callback }): PixiContainer {
    const doorsAndText = args.callbacks.flatMap((cb, i) => [
        Door({ xScaled: i * 1.5 + 1, onClick: cb }),
        args?.descriptions?.[i] != null && Text({ text: args.descriptions[i], x: (i * 1.5 + 1) * doorWidth }),
    ])
    return Container({
        children: [...doorsAndText, PlainButton({ onClick: args.exit, text: 'exit' })]
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

export function DoorsStories(name: 'alert2' | 'log4'): ReturnType<typeof Doors> {
    return {
        alert2: () => Doors({
            callbacks: [
                () => alert('door 1'),
                () => alert('door 2'),
            ],
            exit: () => { alert('exit') }
        },
        ),
        log4: () => Doors({
            callbacks: [
                () => console.log('door 1'),
                () => console.log('door 2'),
                () => console.log('door 3'),
                () => console.log('door 4')
            ],
            exit: () => { console.log('exit') }
        }),
    }[name]()
}
