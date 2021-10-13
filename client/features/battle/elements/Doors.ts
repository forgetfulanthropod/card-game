import { dataOf } from '@/util/pixiUtils'
import { Container, PixiContainer, Sprite } from './mypixi'

export default function Doors(): PixiContainer {
    return Container({
        children: [
            Door({ xScaled: 1 }),
            Door({ xScaled: 2.5 }),
            Door({ xScaled: 4 }),
        ]
    })
}

function Door(args: { xScaled: number }) {
    const texture = dataOf('door')
    const x = texture.width * args.xScaled
    return Sprite({
        x,
        src: texture,
        onClick() { alert(`wow ${x}`) }
    })
}
