import { PixiContainer, PixiSprite } from 'features/battle/elements/mypixi'
import type { Graphics as PixiGraphics } from 'pixi.js'
import { utils } from 'pixi.js'

export function drawCircle(g: PixiGraphics, color: string, x: number, y: number, radius: number): void {
    g.beginFill(utils.string2hex(color))
    g.drawCircle(x, y, radius)
    g.endFill()
}

export function flashSprite(sprite: PixiSprite, { durationMs = 500 } = {}): void {
    sprite.visible = true
    setTimeout(() => {
        sprite.visible = false
    }, durationMs)
}

export function doFlashSprite(
    parent: PixiContainer,
    makeSprite: () => PixiSprite,
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
