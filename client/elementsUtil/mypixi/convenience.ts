// window.PIXI = PIXI
import type { Datum } from 'datums'
import type { DisplayObject } from 'pixi.js'
import type { PixiGraphics } from './aliases'
import {
    PixiContainer,
    PixiSprite,
    PixiText,
    PixiTexture,
    PixiVideoResource,
} from './aliases'
import type { ShownArgs, DisplayObjectArgs } from './_types'
import { applyShownArgs, applyDisplayObjectArgs } from './_applyArgs'
import { Sprite, BASE_WIDTH, BASE_HEIGHT, Container } from './core'
export type PlayablePixiSprite = PixiSprite & { play: () => void }
export function VideoBackground(args: {
    name?: string
    scale: number
    src: string
    autoPlay?: boolean
    bgLoopEnded?: Datum<number>
}): PlayablePixiSprite {
    const r = new PixiVideoResource(args.src, {
        updateFPS: 30,
        autoPlay: args.autoPlay ?? true,
    })

    const source = r.source as HTMLVideoElement
    source.muted = true

    // source.loop = true // must do manually for event!
    const endedCallback = () => {
        args.bgLoopEnded?.set(Date.now())
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
export function onDestroyed<T extends DisplayObject>(
    el: T,
    ...callbacks: Callback[]
): T {
    for (const cb of callbacks) {
        el.on('destroyed', cb)
    }
    return el
}
