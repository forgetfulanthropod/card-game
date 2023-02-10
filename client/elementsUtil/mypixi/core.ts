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
import { Point, SimpleRope } from 'pixi.js'
import { DisplayObject } from '@pixi/animate'
import { getRenderer, isHighResolution } from './application'

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

export function CurvedText({
    text,
    radius,
    maxWidth,
}: {
    text: PixiText
    radius: number
    maxWidth: number
}) {
    const numPointsInHalfCircle = 200

    text.updateText(true) // necessary!
    if (text.width > maxWidth) text.scale.set(maxWidth / text.width)
    const textTexture = getRenderer().generateTexture(text)
    text.destroy(true)

    let numPointsInSegment = Math.round(
        (textTexture.width / (radius * Math.PI)) * numPointsInHalfCircle
    )

    const step = Math.PI / numPointsInHalfCircle

    const points = []
    for (let i = numPointsInSegment / 2; i >= -numPointsInSegment / 2; i--) {
        const x = radius * Math.cos(Math.PI / 2 + step * i)
        const y = radius * Math.sin(Math.PI / 2 + step * i)
        points.push(new Point(x, -y))
    }

    return new SimpleRope(textTexture, points)
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
    const textEl = new TextInstantiator(
        String(text),
        args.style
    )
    textEl.resolution = isHighResolution ? 2 : 1
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
