import { Sprite } from 'pixi.js'

type Pair = [x: number, y: number]

export function MySprite(args: {
    src: string,
    anchor?: number | Pair
    position?: Pair
    scale?: number | Pair
}): Sprite {
    const s = Sprite.from(args.src)

    if (args.anchor)
        if (Array.isArray(args.anchor))
            s.anchor.set(...args.anchor)
        else
            s.anchor.set(args.anchor)

    if (args.position) s.position.set(...args.position)
    if (args.scale) {
        if (Array.isArray(args.scale)) {
            s.scale.set(...args.scale)
        } else {
            s.scale.set(args.scale)
        }
    }
    return s
}
