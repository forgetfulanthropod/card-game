import type { Graphics as PixiGraphics } from 'pixi.js'
import { utils } from 'pixi.js'

export function drawCircle(g: PixiGraphics, color: string, x: number, y: number, radius: number): void {
    g.beginFill(utils.string2hex(color))
    g.drawCircle(x, y, radius)
    g.endFill()
}
