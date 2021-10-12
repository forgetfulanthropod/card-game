import { PixiContainer, PixiLoader, PixiSprite, PixiGraphics, PixiTexture } from '@/features/battle/elements/mypixi'
import { AssetKey } from '@/features/battle/logic/AssetLoader'
import { utils } from 'pixi.js'

export function drawCircle(g: PixiGraphics, color: string, x: number, y: number, radius: number): void {
    g.beginFill(utils.string2hex(color))
    g.drawCircle(x, y, radius)
    g.endFill()
}

export function flashElement(sprite: PixiSprite, { durationMs = 500 } = {}): void {
    sprite.visible = true
    setTimeout(() => {
        sprite.visible = false
    }, durationMs)
}

export function hideElement(sprite: PixiSprite | PixiContainer, { durationMs = 500 } = {}): void {
    console.log('hiding el')
    sprite.visible = false
    setTimeout(() => {
        sprite.visible = true
    }, durationMs)
}

export function doFlashElement(
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

export const dataOf = (assetId: AssetKey): PixiTexture => PixiLoader.shared.resources?.[assetId]?.texture as PixiTexture
