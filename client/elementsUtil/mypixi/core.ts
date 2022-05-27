import type { ROCursor } from 'sbaobab'
import {
    PixiContainer,
    PixiGraphics,
    PixiSprite,
    PixiText,
    PixiTexture,
} from './aliases'
import {
    applyShownArgs,
    applyContainerArgs,
    applyDisplayObjectArgs,
} from './_applyArgs'
import type {
    ContainerArgs,
    TextArgs,
    GraphicsArgs,
    SpriteArgs,
} from './_types'
import { onUpdate } from '@/util'

const core = null
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
    return s
}
export function Container(args: ContainerArgs): PixiContainer {
    const c = new PixiContainer()
    applyContainerArgs(args, c)
    return c
}
export function Text(args: TextArgs): PixiText {
    const text = args.text
    if (typeof text === 'object') {
        if ('get' in text) {
            const textEl = new PixiText(String(text.get()), args.style)
            applyShownArgs(textEl, args)
            const unsub = onUpdate(
                text as ROCursor<string>,
                val => (textEl.text = String(val))
            )
            textEl.on('destroyed', unsub)
            return textEl
        }
        if ('val' in text) {
            const textEl = new PixiText(String(text.val), args.style)
            applyShownArgs(textEl, args)
            const unsub = text.onChange(val => (textEl.text = String(val)))
            textEl.on('destroyed', unsub)
            return textEl
        }
    }
    const textEl = new PixiText(String(text), args.style)
    applyShownArgs(textEl, args)
    return textEl
}
export function Graphics(args: GraphicsArgs): PixiGraphics {
    const g = new PixiGraphics()
    args.draw(g)
    applyDisplayObjectArgs(g, args)
    return g
}
