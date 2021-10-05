import {
    Application as PixiApplication,
    Container as PixiContainer,
    Sprite as PixiSprite,
    Loader as PixiLoader,
    Text as PixiText,
    Texture as PixiTexture,
    VideoResource as PixiVideoResource,
    Ticker as PixiTicker,
    ITextStyle
} from 'pixi.js'
// export { PixiLoader }
// TODO: export the types instead of constructors
export { PixiTicker, PixiApplication, PixiLoader, PixiContainer, PixiSprite, PixiText, PixiTexture, PixiVideoResource }

// export type Sprite = PixiSprite

type Pair = [x: number, y: number]

interface Positioning {
    position?: Pair
    scale?: number | Pair
    width?: number
    height?: number
    pivot?: number | Pair
    x?: number
    y?: number
    anchor?: number | Pair
}

export type OnSpriteTick = (self: PixiSprite, delta: number) => void | 'remove'
interface SpriteArgs extends Positioning {
    src: string | PixiTexture
    onTick?: OnSpriteTick
    tint?: number
    alpha?: number
}
export type OnContainerTick = (self: PixiContainer, delta: number) => void | 'remove'
interface ContainerArgs extends Positioning {
    children: (PixiSprite | PixiContainer)[]
    onTick?: OnContainerTick
}

interface TextArgs extends Positioning {
    text: string
    style: Partial<ITextStyle>
}

export function Sprite(args: SpriteArgs): PixiSprite {
    const s = PixiSprite.from(args.src)

    if (args.anchor != null) {
        if (Array.isArray(args.anchor)) {
            s.anchor.set(...args.anchor)
        } else {
            s.anchor.set(args.anchor)
        }
    }
    if (args.onTick != null) {
        PixiTicker.shared.add(function cb(dt) {
            const result = args.onTick(s, dt)
            if (result === 'remove')
                PixiTicker.shared.remove(cb)
        })
    }
    if (args.tint != null) {
        s.tint = args.tint
    }

    if (args.alpha != null) {
        s.alpha = args.alpha
    }

    applyPositioningArgs(s, args)
    return s
}

function applyPositioningArgs(x: PixiContainer | PixiSprite, args: Positioning) {
    if (args.position != null) { x.position.set(...args.position) }
    if (args.scale != null) {
        if (Array.isArray(args.scale)) {
            x.scale.set(...args.scale)
        } else {
            x.scale.set(args.scale)
        }
    }

    if (args.width != null) { x.width = args.width }
    if (args.height != null) { x.height = args.height }
    if (args.pivot != null) {
        if (Array.isArray(args.pivot)) {
            x.pivot.set(...args.pivot)
        } else {
            x.pivot.set(args.pivot)
        }
    }
    if (args.x != null) { x.x = args.x }
    if (args.y != null) { x.y = args.y }
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
    applyPositioningArgs(c, args)
    for (const ch of args.children) {
        c.addChild(ch)
    }
    if (args.onTick != null) {
        PixiTicker.shared.add(function cb(dt) {
            const result = args.onTick(s, dt)
            if (result === 'remove')
                PixiTicker.shared.remove(cb)
        })
    }
    return c
}

export function Text(args: TextArgs): PixiText {
    const c = new PixiText(args.text, args.style)
    applyPositioningArgs(c, args)
    return c
}

export function VideoBackground(args: { scale: number, src: string }): PixiSprite {
    const r = new PixiVideoResource(args.src, { updateFPS: 24 })
    const source = r.source as HTMLVideoElement
    source.muted = true
    source.loop = true
    const sprite = PixiSprite.from(PixiTexture.from(r.source))
    sprite.width = 1920 * args.scale
    return sprite
}
