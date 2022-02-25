import type { DisplayObject, Graphics as PixiGraphics } from 'pixi.js'
import { utils } from 'pixi.js'

import type { PixiContainer, PixiSprite } from '@/elementsUtil'

export { getTexture } from '@/features/battle/logic/assetGetters'

export function drawCircle(
    g: PixiGraphics,
    color: string,
    x: number,
    y: number,
    radius: number
): void {
    g.beginFill(utils.string2hex(color))
    g.drawCircle(x, y, radius)
    g.endFill()
}

export function flashElement(
    sprite: PixiSprite,
    { durationMs = 500 } = {}
): void {
    sprite.visible = true
    setTimeout(() => {
        sprite.visible = false
    }, durationMs)
}

export function hideElement(
    sprite: PixiSprite | PixiContainer,
    { durationMs = 500 } = {}
): void {
    sprite.visible = false
    setTimeout(() => {
        sprite.visible = true
    }, durationMs)
}

export function flashTo(
    parent: PixiContainer,
    makeSprite: () => PixiSprite | PixiContainer,
    { durationMs = 500, sort = true } = {}
): void {
    const s = makeSprite()
    parent.addChild(s)

    if (sort) {
        parent.sortChildren()
    }
    setTimeout(() => {
        if (parent != null) {
            parent.removeChild(s)
            s.destroy()
        }
    }, durationMs)
}

export function clearContainer(container: PixiContainer): void {
    const children = container.children
    container.removeChildren()

    for (const x of children) {
        x.destroy()
    }
}

export function bringToTop(o: DisplayObject): void {
    const parent = o.parent

    if (parent == null) return

    parent.removeChild(o)
    parent.addChild(o)
}
