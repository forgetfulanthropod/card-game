import {
    Application as PixiApplication,
    Container as PixiContainer,
    Filter as PixiFilter,
    Graphics as PixiGraphics,
    Sprite as PixiSprite,
    Loader as PixiLoader,
    Text as PixiText,
    Texture as PixiTexture,
    VideoResource as PixiVideoResource,
    Ticker as PixiTicker,
    InteractionEvent,
    ITextStyle
} from 'pixi.js'
import { BASE_HEIGHT, BASE_WIDTH } from 'data/battle/constants'
import { registerPixiInspector } from 'util/pixiInspector'
// export { PixiLoader }
// TODO: export the types instead of constructors
export { PixiTicker, PixiApplication, PixiLoader, PixiContainer, PixiSprite, PixiText, PixiTexture, PixiVideoResource, PixiGraphics }

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
    filters?: (PixiFilter | null | false | undefined)[]
    onClick?: (e: InteractionEvent) => void
}
export type PixiChildren = (PixiSprite | PixiContainer | null | false | undefined)[]
export type OnContainerTick = (self: PixiContainer, delta: number) => void | 'remove'
interface ContainerArgs extends Positioning {
    children: PixiChildren
    onTick?: OnContainerTick
}

interface TextArgs extends Positioning {
    text: string
    style?: Partial<ITextStyle>
}

interface GraphicsArgs extends Positioning {
    draw: (g: PixiGraphics) => void
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
            const result = args.onTick && args.onTick(s, dt)
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

    if (args.filters != null) {
        const filters = args.filters.filter(Boolean) as PixiFilter[]
        s.filters = filters
    }

    if (args.onClick != null) {
        s.interactive = true
        s.on('onClick', args.onClick)
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
    registerPixiInspector()
    return app
}

export function Container(args: ContainerArgs): PixiContainer {
    const c = new PixiContainer()
    applyPositioningArgs(c, args)
    for (const ch of args.children) {
        if (ch != null && ch !== false) {
            c.addChild(ch)
        }
    }
    if (args.onTick != null) {
        PixiTicker.shared.add(function cb(dt) {
            const result = args.onTick && args.onTick(c, dt)
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


export function Graphics(args: GraphicsArgs): PixiGraphics {
    const g = new PixiGraphics()
    args.draw(g)
    applyPositioningArgs(g, args)
    return g
}

export function VideoBackground(args: { scale: number, src: string }): PixiSprite {
    const r = new PixiVideoResource(args.src, { updateFPS: 24 })
    const source = r.source as HTMLVideoElement
    source.muted = true
    source.loop = true
    const sprite = PixiSprite.from(PixiTexture.from(r.source))
    sprite.width = BASE_WIDTH * args.scale
    sprite.height = BASE_HEIGHT * args.scale
    return sprite
}
