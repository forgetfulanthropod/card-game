import type { Graphics as PixiGraphics } from 'pixi.js'
import { utils } from 'pixi.js'

import type { PixiContainer, PixiSprite, PixiTexture } from '@/features/battle/elements/mypixi'
import { PixiLoader } from '@/features/battle/elements/mypixi'
import type { AssetKey } from '@/features/battle/logic/AssetLoader'


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
    sprite.visible = false
    setTimeout(() => {
        sprite.visible = true
    }, durationMs)
}

export function doFlashElement(
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

export function dataOf(assetId: AssetKey): PixiTexture {
    return PixiLoader.shared.resources?.[assetId]?.texture as PixiTexture
}
