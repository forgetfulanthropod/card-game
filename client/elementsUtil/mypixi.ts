// window.PIXI = PIXI
import type { RODatum } from 'datums'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { sortBy, uniq } from 'lodash'
import type {
    DisplayObject,
    Filter as PixiFilter,
    IDestroyOptions,
    InteractionEvent,
    ITextStyle,
} from 'pixi.js'
import {
    Application as PixiApplication,
    Container as PixiContainer,
    DisplayObject as PixiDisplayObject,
    Graphics as PixiGraphics,
    Loader as PixiLoader,
    Renderer,
    Sprite as PixiSprite,
    Text as PixiText,
    Texture as PixiTexture,
    Ticker as PixiTicker,
    VideoResource as PixiVideoResource,
} from 'pixi.js'
import { Tweener } from 'pixi-tweener'

import { bgLoopEnded } from '@/util'

import type { InteractionEvents } from './InteractionEvents'
import { bindEvents } from './InteractionEvents'
import { registerPixiInspector } from './pixiInspector'

// ...

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
export const SCALE_UNIVERSAL = BASE_WIDTH / 1920

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
    // deprecated
    onClick?: InteractionEventHandler
    // deprecated
    onMouseover?: InteractionEventHandler
    // deprecated
    onMouseout?: InteractionEventHandler
    events?: InteractionEvents
    name?: string
    zIndex?: number
    visible?: boolean
    angle?: number
    rotation?: number
    onDestroy?: Callback[]
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

interface GraphicsArgs extends DisplayObjectArgs {
    tint?: number
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
    el: PixiContainer | PixiSprite | PixiText | PixiGraphics,
    args: DisplayObjectArgs
) {
    bindEvents(args.events, el)

    if (args.onClick != null) {
        el.interactive = true
        el.on('pointerdown', args.onClick)
    }

    if (args.onMouseover != null) {
        el.interactive = true
        el.on('pointerover', args.onMouseover)
    }
    if (args.onMouseout != null) {
        el.interactive = true
        el.on('pointerout', args.onMouseout)
    }

    if (args.position != null) {
        el.position.set(...args.position)
    }
    if (args.scale != null) {
        if (Array.isArray(args.scale)) {
            el.scale.set(...args.scale)
        } else {
            el.scale.set(args.scale)
        }
    }

    if (args.width != null) {
        el.width = args.width
    }
    if (args.height != null) {
        el.height = args.height
    }
    if (args.pivot != null) {
        if (Array.isArray(args.pivot)) {
            el.pivot.set(...args.pivot)
        } else {
            el.pivot.set(args.pivot)
        }
    }
    if (args.x != null) {
        el.x = args.x
    }
    if (args.y != null) {
        el.y = args.y
    }

    if (args.onTick != null) {
        PixiTicker.shared.add(function cb(dt) {
            const result = args.onTick && args.onTick(el, dt)
            if (result === 'remove') PixiTicker.shared.remove(cb)
        })
    }

    if (args.alpha != null) {
        el.alpha = args.alpha
    }

    if (args.filters != null) {
        const filters = args.filters.filter(Boolean) as PixiFilter[]
        el.filters = filters
    }

    if (args.name != null) {
        el.name = args.name
    }

    if (args.zIndex != null) {
        el.zIndex = args.zIndex
    }
    if (args.visible != null) {
        el.visible = args.visible
    }

    if (args.angle != null) {
        el.angle = args.angle
    }
    if (args.rotation != null) {
        el.rotation = args.rotation
    }

    if (args.onDestroy != null) {
        el.on('destroyed', () => {
            args?.onDestroy?.forEach(cb => cb())
        })
    }
    // if (args.onDestroy != null) {
    //     const destroy = el.destroy
    //     el.destroy = (...destroyArgs) => {
    //         destroy.call(el, ...destroyArgs)
    //         args.onDestroy?.forEach(cb => cb())
    //     }
    // }
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
    const resW = (1920 * 2) / 2
    const resH = (1080 * 2) / 2

    app = new PixiApplication({
        view: args.canvas,
        // resolution: window.devicePixelRatio || 1,
        // backgroundColor: 0x6495ed,
        width: resW,
        height: resH,
        antialias: true,
    })

    app.stage.scale.set(resW / 1920)
    app.ticker.maxFPS = 30

    // const delay = 10_000
    // let frames = 0
    // app.ticker.add(() => frames++)
    // setTimeout(() => console.log('TRUE FPS:', frames / (delay / 1000)), delay)

    Tweener.init(app.ticker)

    setTimeout(function CornerEl() {
        const div = document.createElement('div')
        div.style.fontSize = '14px'
        div.style.fontFamily = 'monospace'
        div.style.color = 'white'
        div.style.position = 'absolute'
        div.style.top = '0px'

        // eslint-disable-next-line
        app!.ticker.add(_ => {
            div.innerText = `${Math.round(
                // eslint-disable-next-line
                app!.ticker.FPS
            )} frames per second`
        })
        document.body.appendChild(div)
    }, 10)

    for (const c of args.children) {
        app.stage.addChild(c)
    }
    // @ts-expect-error
    window.app = app
    registerPixiInspector()
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
    // if (args.onTick != null) {
    //     PixiTicker.shared.add(function cb(dt) {
    //         const result = args.onTick && args.onTick(c, dt)
    //         if (result === 'remove') PixiTicker.shared.remove(cb)
    //     })
    // }
    // if (args.name != null) {
    //     c.name = args.name
    // }
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

export type PlayablePixiSprite = PixiSprite & { play: () => void }

export function VideoBackground(args: {
    name?: string
    scale: number
    src: string
    autoPlay?: boolean
}): PlayablePixiSprite {
    const r = new PixiVideoResource(args.src, {
        updateFPS: 30,
        autoPlay: args.autoPlay ?? true,
    })

    const source = r.source as HTMLVideoElement
    source.muted = true

    // source.loop = true // must do manually for event!
    const endedCallback = () => {
        bgLoopEnded.set(Date.now())
        void source.play()
    }
    source.addEventListener('ended', endedCallback)

    const sprite = Sprite({
        src: PixiTexture.from(r.source),
        onDestroy: [() => r.destroy()],
        anchor: 0.5,
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 2,
    }) as PlayablePixiSprite

    sprite.play = source.play.bind(source)

    void r.load().then(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))

        if (sprite.width / sprite.height >= BASE_WIDTH / BASE_HEIGHT) {
            // too wide
            sprite.scale.set(BASE_HEIGHT / sprite.height)
        } else {
            // too square
            sprite.scale.set(BASE_WIDTH / sprite.width)
        }

        sprite.on('animationEnd', () => {})
    })
    // sprite.width = BASE_WIDTH * args.scale
    // sprite.height = BASE_HEIGHT * args.scale
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

export function If(
    condition: RODatum<boolean>,
    ifRender: () => DisplayObject,
    elseRender?: () => DisplayObject,
    destroyOptions: IDestroyOptions | boolean | undefined = { children: true }
): PixiContainer {
    const onDestroy: Callback[] = []
    const root = Container({ children: [], onDestroy })
    onDestroy.push(condition.onChange(handleChange, true))
    return root
    function handleChange(val: boolean) {
        root.children.forEach(c => c.destroy(destroyOptions))
        root.removeChildren()
        if (val) {
            root.addChild(ifRender())
        } else if (elseRender != null) {
            root.addChild(elseRender())
        }
    }
}

type KeyedDisplayObject = DisplayObject & { key: string | number }
interface KeyedContainer extends PixiContainer {
    children: KeyedDisplayObject[]
}
export function For<T extends { key: string | number }[]>(
    items: RODatum<T>,
    render: (item: T[number]) => DisplayObject,
    position?: (index: number) => { x?: number; y?: number },
    destroyOptions: IDestroyOptions | boolean | undefined = { children: true }
): PixiContainer {
    const onDestroy: Callback[] = []
    const root = Container({ children: [], onDestroy }) as KeyedContainer
    onDestroy.push(items.onChange(handleUpdate, true))

    let warnedAlready = false
    return root
    function handleUpdate(items: T) {
        const keys = items.map(v => v.key)
        if (uniq(keys).length !== keys.length && !warnedAlready) {
            console.warn('duplicate keys in For:', duplicated(keys))
            warnedAlready = true
        }

        root.children.forEach(c => {
            if (!keys.includes(c.key)) {
                c.destroy(destroyOptions)
                root.removeChild(c)
            }
        })
        const oldChildren = root.children.filter(c => keys.includes(c.key))
        const oldKeys = oldChildren.map(c => c.key)
        const newItems = items.filter(it => !oldKeys.includes(it.key))
        const newChildren = newItems.map(it => {
            const c = render(it) as KeyedDisplayObject
            c.key = it.key
            return c
        })
        // redundant filter is necessary because children doesn't necessarily update immediately
        root.removeChildren()
        const sortedChildren = sortBy([...newChildren, ...oldChildren], x =>
            keys.indexOf(x.key)
        )
        if (sortedChildren.length > 0) root.addChild(...sortedChildren)
        if (position != null) {
            for (let i = 0; i < root.children.length; i++) {
                const c = root.children[i]
                const { x, y } = position(i)
                if (x != null) c.x = x
                if (y != null) c.y = y
            }
        }
    }
}

export function portalize(args: {
    from: DisplayObject
    content: DisplayObject
    to?: PixiContainer
}): void {
    if (args.to == null && app?.stage == null) {
        throw Error('no app.stage')
    }
    const { from, content, to = app?.stage } = args
    if (to == null) throw Error('unreachable: portal: to == null')
    to.addChild(content)
    from.on('destroyed', () => {
        to.removeChild(content)
        content.destroy({ children: true })
    })
}

type TypeArgPairs =
    | [PixiGraphics, DisplayObjectArgs]
    | [PixiText, ShownArgs]
    | [PixiContainer, DisplayObjectArgs]
    | [PixiSprite, ShownArgs]
    | [DisplayObject, DisplayObjectArgs]

export function Adjust<T extends TypeArgPairs>(...args_: T): T[0] {
    const [el, args] = args_
    if (el instanceof PixiSprite || el instanceof PixiText) {
        applyShownArgs(el, args)
    } else if (el instanceof PixiContainer) {
        applyDisplayObjectArgs(el, args)
    }
    return el
}

function duplicated<T>(arr: T[]): T[] {
    const seen = new Set<T>()
    const dups = new Set<T>()
    arr.forEach(x => {
        if (seen.has(x)) dups.add(x)
        seen.add(x)
        return false
    })
    return Array.from(dups)
}
