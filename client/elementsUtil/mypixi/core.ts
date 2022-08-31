import type { ROCursor } from 'sbaobab'
import {
    PixiContainer,
    PixiGraphics,
    PixiHTMLText,
    PixiSprite,
    PixiText,
    PixiTexture,
} from './aliases'
import { applyShownArgs, applyDisplayObjectArgs } from './_applyArgs'
import type {
    ContainerArgs,
    TextArgs,
    GraphicsArgs,
    SpriteArgs,
    ContainerChildren,
} from './_types'
import { startChecking } from './_util'
import { onUpdate } from '@/util'

export const BASE_HEIGHT = 1080
export const BASE_WIDTH = 1920
export const SCALE_UNIVERSAL = BASE_WIDTH / 1920
// export type Sprite = PixiSprite
export function Sprite(args: SpriteArgs): PixiSprite {
    if (args.src == null) {
        console.error(`Sprite named '${args.name}' received null src arg`)
        console.trace()
        return PixiSprite.from(PixiTexture.WHITE)
    }
    const s = PixiSprite.from(args.src)

    applyShownArgs(s, args)
    startChecking(s)
    return s
}
export function Container(
    args: ContainerArgs,
    ...children: ContainerChildren
): PixiContainer {
    const c = new PixiContainer()
    children.forEach(ch => ch && c.addChild(ch))
    applyDisplayObjectArgs(c, args)
    if (args.cache === true) c.cacheAsBitmap = true
    startChecking(c)
    return c
}
export function Text(args: TextArgs): PixiText {
    const text = args.text

    const TextInstantiator = args.isHtml ? PixiHTMLText : PixiText
    if (typeof text === 'object') {
        if ('get' in text) {
            const textEl = new TextInstantiator(String(text.get()), args.style)
            applyShownArgs(textEl, args)
            const unsub = onUpdate(
                text as ROCursor<string>,
                val => (textEl.text = String(val))
            )
            textEl.on('destroyed', unsub)
            return textEl as PixiText
        }
        if ('val' in text) {
            const textEl = new TextInstantiator(String(text.val), args.style)
            applyShownArgs(textEl, args)
            const unsub = text.onChange(val => (textEl.text = String(val)))
            textEl.on('destroyed', unsub)
            return textEl as PixiText
        }
    }
    const textEl = new TextInstantiator(String(text), args.style)
    applyShownArgs(textEl, args)
    startChecking(textEl)
    return textEl as PixiText
}

export function Graphics(args: GraphicsArgs): PixiGraphics {
    const g = new PixiGraphics()
    args.draw(g)
    applyDisplayObjectArgs(g, args)
    startChecking(g)
    return g
}
