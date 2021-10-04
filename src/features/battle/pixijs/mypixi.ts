import {
    Application as PixiApplication,
    Container as PixiContainer,
    Sprite as PixiSprite,
    Texture as PixiTexture,
    VideoResource as PixiVideoResource
} from 'pixi.js'
export { PixiApplication, PixiSprite, PixiTexture, PixiVideoResource }
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
    children: (PixiSprite | PixiContainer)[]
}

export function Sprite(args: SpriteArgs): PixiSprite {
    const s = PixiSprite.from(args.src)

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

function applyArgs(x: PixiContainer | PixiSprite, args: GenericArgs) {
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

export function Application(args: {
    canvas: HTMLCanvasElement,
    children: (PixiSprite | PixiContainer)[]
}): PixiApplication {
    const app = new PixiApplication({
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

export function Container(args: ContainerArgs): PixiContainer {
    const c = new PixiContainer()
    applyArgs(c, args)
    for (const ch of args.children) {
        c.addChild(ch)
    }
    return c
}


export function VideoBackground(args: { scale: number, src: string }): Sprite {
    const r = new PixiVideoResource(args.src, { updateFPS: 24 })
    const source = r.source as HTMLVideoElement
    source.muted = true
    source.loop = true
    const sprite = PixiSprite.from(PixiTexture.from(r.source))
    sprite.width = 1920 * args.scale
    return sprite
}
