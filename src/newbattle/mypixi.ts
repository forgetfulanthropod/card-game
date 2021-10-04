import { Application, Container, Sprite, Texture, VideoResource } from 'pixi.js'
export { Application, Sprite, Texture, VideoResource }
type Pair = [x: number, y: number]

interface GenericArgs {
    position?: Pair
    scale?: number | Pair
    width?: number
    height?: number
    pivot?: number | Pair
    x?: number
    y?: number
    anchor?: number | Pair
}

interface SpriteArgs extends GenericArgs {
    src: string
}

interface ContainerArgs extends GenericArgs {
    children: (Sprite | Container)[]
}

export function MySprite(args: SpriteArgs): Sprite {
    const s = Sprite.from(args.src)

    if (args.anchor) {
        if (Array.isArray(args.anchor)) {
            s.anchor.set(...args.anchor)
        } else {
            s.anchor.set(args.anchor)
        }
    }

    applyArgs(s, args)
    return s
}

function applyArgs(x: Container | Sprite, args: GenericArgs) {
    if (args.position) { x.position.set(...args.position) }
    if (args.scale) {
        if (Array.isArray(args.scale)) {
            x.scale.set(...args.scale)
        } else {
            x.scale.set(args.scale)
        }
    }

    if (args.width) { x.width = args.width }
    if (args.height) { x.height = args.height }
    if (args.pivot) {
        if (Array.isArray(args.pivot)) {
            x.pivot.set(...args.pivot)
        } else {
            x.pivot.set(args.pivot)
        }
    }
    if (args.x) { x.x = args.x }
    if (args.y) { x.y = args.y }
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

export function MyContainer(args: ContainerArgs): Container {
    const c = new Container()
    applyArgs(c, args)
    for (const ch of args.children) {
        c.addChild(ch)
    }
    return c
}
