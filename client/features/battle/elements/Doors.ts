import { dataOf } from '@/util/pixiUtils'
import { Container, PixiContainer, Sprite } from './mypixi'

export default function Doors(args: { callbacks: Callback[] }): PixiContainer {
    return Container({
        children: args.callbacks.map((cb, i) =>
            Door({ xScaled: i * 1.5 + 1, onClick: cb }))
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
