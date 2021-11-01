import PlainButton from '@/elements/PlainButton'
import type { PixiContainer } from '@/elementsUtil'
import { Container, dataOf, getAppSize, Sprite, Text } from '@/elementsUtil'


const doorWidth = 330
const BASE_HEIGHT = 1080

export default function Doors(args: { callbacks: Callback[], descriptions?: string[], exit: Callback }): PixiContainer {
    const doorsAndText = args.callbacks.flatMap((cb, i) => {
        const door = Door({ xScaled: i * 1.15 + .5, onClick: cb })
        const text = args?.descriptions?.[i] != null &&
            Text({
                text: args.descriptions[i],
                x: (i * 1.15 + .5) * doorWidth,
                y: getAppSize().height / 2,
                anchor: [.5, 0],
                width: doorWidth,
                style: {
                    fill: 'white',
                },
            })
        return [door, text]
    })
    const container = Container({
        name: 'Doors',
        children: doorsAndText,
    })
    container.x = getAppSize().width / 2
    container.pivot.x = container.width / 2
    container.addChild(PlainButton({ onClick: args.exit, text: 'exit' }))
    return container
}

function Door(args: { xScaled: number, onClick: Callback }) {
    const texture = dataOf('door')
    const x = doorWidth * args.xScaled
    console.log({ scale: doorWidth / texture.width })
    return Sprite({
        x,
        y: BASE_HEIGHT / 2,
        anchor: [.5, .5],
        scale: doorWidth / texture.width,
        src: texture,
        onClick: args.onClick,
    })
}

export function DoorsStories(name: 'alert2' | 'log4'): ReturnType<typeof Doors> {
    return {
        alert2: () => Doors({
            callbacks: [
                () => alert('door 1'),
                () => alert('door 2'),
            ],
            exit: () => { alert('exit') },
        },
        ),
        log4: () => Doors({
            callbacks: [
                () => console.log('door 1'),
                () => console.log('door 2'),
                () => console.log('door 3'),
                () => console.log('door 4'),
            ],
            exit: () => { console.log('exit') },
        }),
    }[name]()
}
