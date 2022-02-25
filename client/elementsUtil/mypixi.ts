// window.PIXI = PIXI
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import type {
    Filter as PixiFilter,
    InteractionEvent,
    ITextStyle,
} from 'pixi.js'
import { DisplayObject as PixiDisplayObject } from 'pixi.js'
import { Renderer } from 'pixi.js'
import {
    Application as PixiApplication,
    Container as PixiContainer,
    Graphics as PixiGraphics,
    Loader as PixiLoader,
    Sprite as PixiSprite,
    Text as PixiText,
    Texture as PixiTexture,
    Ticker as PixiTicker,
    VideoResource as PixiVideoResource,
} from 'pixi.js'
// import * as PIXI from 'pixi.js'

gsap.registerPlugin(PixiPlugin)

PixiPlugin.registerPIXI({
    // Ticker: PixiTicker.shared,
    DisplayObject: PixiDisplayObject,
})
// import * as tweenManager from 'pixi-tween'
// void PIXI
// void tweenManager
// import { registerPixiInspector } from '@/elementsUtil'

// export { PixiLoader }
// TODO: export the types instead of constructors
export {
    PixiApplication,
    PixiContainer,
    PixiGraphics,
    PixiLoader,
    PixiSprite,
    PixiText,
    PixiTexture,
    PixiTicker,
    PixiVideoResource,
}

// export const myPIXI = { tweenManager }

// PixiTicker.shared.add((frames: number) => {
//     tweenManager.update((1000 / 60) * frames)
// })

export const BASE_HEIGHT = 1080
export const BASE_WIDTH = 1920

// export type Sprite = PixiSprite

type Pair = [x: number, y: number]

export type InteractionEventHandler = (e: InteractionEvent) => void

interface DisplayObjectArgs {
    position?: Pair
    scale?: number | Pair
    width?: number
    height?: number
    pivot?: number | Pair
    x?: number
    y?: number
    onTick?: OnPixiTick
    alpha?: number
    filters?: (PixiFilter | null | false | undefined)[]
    onClick?: InteractionEventHandler
    onMouseover?: InteractionEventHandler
    onMouseout?: InteractionEventHandler
    name?: string
    zIndex?: number
    visible?: boolean
    angle?: number
    rotation?: number
}

// text and sprite but not graphics
interface ShownArgs extends DisplayObjectArgs {
    tint?: number
    anchor?: number | Pair
}

export type OnPixiTick = (
    self: PixiSprite | PixiContainer,
    delta: number
) => void | 'remove'
export interface SpriteArgs extends ShownArgs {
    src: string | PixiTexture
}
export type PixiChildren = (
    | PixiSprite
    | PixiContainer
    | PixiDisplayObject
    | null
    | false
    | undefined
)[]
type OnContainerTick = (self: PixiContainer, delta: number) => void | 'remove'
interface ContainerArgs extends DisplayObjectArgs {
    children?: PixiChildren
    onTick?: OnContainerTick
    name?: string
    cache?: boolean
}

interface TextArgs extends ShownArgs {
    text: string
    style?: Partial<ITextStyle>
}

interface GraphicsArgs extends ShownArgs {
    draw: (g: PixiGraphics) => void
}

export function Sprite(args: SpriteArgs): PixiSprite {
    if (args.src == null) {
        console.error(`Sprite named '${args.name}' received null src arg`)
        console.trace()
        return PixiSprite.from(PixiTexture.WHITE)
    }
    const s = PixiSprite.from(args.src)

    applyShownArgs(s, args)
    return s
}

function applyDisplayObjectArgs(
    x: PixiContainer | PixiSprite | PixiText | PixiGraphics,
    args: DisplayObjectArgs
) {
    if (args.position != null) {
        x.position.set(...args.position)
    }
    if (args.scale != null) {
        if (Array.isArray(args.scale)) {
            x.scale.set(...args.scale)
        } else {
            x.scale.set(args.scale)
        }
    }

    if (args.width != null) {
        x.width = args.width
    }
    if (args.height != null) {
        x.height = args.height
    }
    if (args.pivot != null) {
        if (Array.isArray(args.pivot)) {
            x.pivot.set(...args.pivot)
        } else {
            x.pivot.set(args.pivot)
        }
    }
    if (args.x != null) {
        x.x = args.x
    }
    if (args.y != null) {
        x.y = args.y
    }

    if (args.onTick != null) {
        PixiTicker.shared.add(function cb(dt) {
            const result = args.onTick && args.onTick(x, dt)
            if (result === 'remove') PixiTicker.shared.remove(cb)
        })
    }

    if (args.alpha != null) {
        x.alpha = args.alpha
    }

    if (args.filters != null) {
        const filters = args.filters.filter(Boolean) as PixiFilter[]
        x.filters = filters
    }

    if (args.onClick != null) {
        x.interactive = true
        x.on('click', args.onClick)
    }

    if (args.onMouseover != null) {
        x.interactive = true
        x.on('mouseover', args.onMouseover)
    }
    if (args.onMouseout != null) {
        x.interactive = true
        x.on('mouseout', args.onMouseout)
    }
    if (args.name != null) {
        x.name = args.name
    }

    if (args.zIndex != null) {
        x.zIndex = args.zIndex
    }
    if (args.visible != null) {
        x.visible = args.visible
    }

    if (args.angle != null) {
        x.angle = args.angle
    }
    if (args.rotation != null) {
        x.rotation = args.rotation
    }
}

function applyShownArgs(x: PixiSprite | PixiText, args: ShownArgs) {
    applyDisplayObjectArgs(x, args)
    if (args.tint != null) {
        x.tint = args.tint
    }

    if (args.anchor != null) {
        if (Array.isArray(args.anchor)) {
            x.anchor.set(...args.anchor)
        } else {
            x.anchor.set(args.anchor)
        }
    }
}
let app: null | PixiApplication = null
export function Application(args: {
    canvas: HTMLCanvasElement
    children: (PixiSprite | PixiContainer)[]
}): PixiApplication {
    app = new PixiApplication({
        view: args.canvas,
        resolution: window.devicePixelRatio || 1,
        // backgroundColor: 0x6495ed,
        width: 1920,
        height: 1080,
    })
    for (const c of args.children) {
        app.stage.addChild(c)
    }
    // @ts-expect-error
    window.app = app
    // registerPixiInspector()
    return app
}
export function getPixiApp(): PixiApplication {
    if (app == null) throw Error('pixi application is null')
    return app
}
export function getRenderer(): Renderer {
    const app = getPixiApp()

    if (
        !(app instanceof PixiApplication) ||
        !(app.renderer instanceof Renderer)
    )
        throw new Error("The pixi app isn't ready yet sir")

    return app.renderer
    // return (getPixiApp() as PixiApplication).renderer as Renderer
}
export function getAppSize(): { width: number; height: number } {
    if (app == null) throw Error('pixi application is null')
    const { width, height } = app.stage
    return { width, height }
}

export function Container(args: ContainerArgs): PixiContainer {
    const c = new PixiContainer()
    for (const ch of args.children || []) {
        if (ch != null && ch !== false) {
            c.addChild(ch)
        }
    }
    applyDisplayObjectArgs(c, args)
    if (args.onTick != null) {
        PixiTicker.shared.add(function cb(dt) {
            const result = args.onTick && args.onTick(c, dt)
            if (result === 'remove') PixiTicker.shared.remove(cb)
        })
    }
    if (args.name != null) {
        c.name = args.name
    }
    if (args.cache === true) {
        c.cacheAsBitmap = true
    }

    return c
}

export function Text(args: TextArgs): PixiText {
    const text = new PixiText(args.text, args.style)
    applyShownArgs(text, args)
    return text
}

export function Graphics(args: GraphicsArgs): PixiGraphics {
    const g = new PixiGraphics()
    args.draw(g)
    applyDisplayObjectArgs(g, args)
    return g
}

export function VideoBackground(args: {
    name?: string
    scale: number
    src: string
}): PixiSprite {
    const r = new PixiVideoResource(args.src, { updateFPS: 24 })
    const source = r.source as HTMLVideoElement
    source.muted = true
    source.loop = true
    const sprite = PixiSprite.from(PixiTexture.from(r.source))
    sprite.width = BASE_WIDTH * args.scale
    sprite.height = BASE_HEIGHT * args.scale
    if (args.name) {
        sprite.name = args.name
    }
    sprite.zIndex = -1
    return sprite
}

export function PngLayersBackground(args: {
    name?: string
    scale: number
    srcs: string[] | PixiTexture[]
}): PixiContainer {
    return Container({
        children: args.srcs.map(src =>
            Sprite({
                src,
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
                zIndex: -1,
            })
        ),
    })
}
