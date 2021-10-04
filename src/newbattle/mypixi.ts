import { Application, Container, Sprite, Texture, VideoResource } from 'pixi.js'
export { Application, Sprite, Texture, VideoResource }
type Pair = [x: number, y: number]

export function MySprite(args: {
    src: string,
    anchor?: number | Pair
    position?: Pair
    scale?: number | Pair
    width?: number
    height?: number
    pivot?: number | Pair
}): Sprite {
    const s = Sprite.from(args.src)

    if (args.anchor) {
        if (Array.isArray(args.anchor)) {
            s.anchor.set(...args.anchor)
        } else {
            s.anchor.set(args.anchor)
        }
    }

    if (args.position) { s.position.set(...args.position) }
    if (args.scale) {
        if (Array.isArray(args.scale)) {
            s.scale.set(...args.scale)
        } else {
            s.scale.set(args.scale)
        }
    }

    if (args.width) { s.width = args.width }
    if (args.height) { s.height = args.height }
    if (args.pivot) {
        if (Array.isArray(args.pivot)) {
            s.pivot.set(...args.pivot)
        } else {
            s.pivot.set(args.pivot)
        }
    }
    return s
}

export function MyApplication(args: {
    canvas: HTMLCanvasElement,
    children: (Sprite | Container)[]
}): Application {
    const app = new Application({
        view: args.canvas,
        resolution: window.devicePixelRatio || 1,
        // backgroundColor: 0x6495ed,
        width: 1920,
        height: 1080,
    })
    for (const c of args.children) {
        app.stage.addChild(c)
    }
    return app
}
