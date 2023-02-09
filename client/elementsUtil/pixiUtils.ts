import type { DisplayObject, Graphics as PixiGraphics } from 'pixi.js'
import { utils } from 'pixi.js'

import { getStage, PixiContainer, PixiSprite, PixiText } from '@/elementsUtil'

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
            if (!s.destroyed) s.destroy()
        }
    }, durationMs)
}

export function clearContainer(container: PixiContainer): void {
    ;[...container.children].forEach(c => c.destroy({ children: true }))
    container.removeChildren()
}

export function bringToTop(o: DisplayObject): void {
    const parent = o.parent

    if (parent == null) return

    parent.removeChild(o)
    parent.addChild(o)
}

export const getShowOnHoverFns = (el: PixiContainer) => ({
    onMouseover: () => getStage().addChild(el),
    onMouseout: () => getStage().removeChild(el),
})

export const animateNumberInElement = async (
    element: PixiText,
    text: string,
    finalNumber: number,
    speed: 'slow' | 'normal' | 'fast' = 'normal'
): Promise<void> => {
    let initialNumber = 0
    const numberIncrement = speed === 'slow' ? 1 : speed === 'normal' ? 2 : 3
    const intervalSpeed =
        speed === 'slow' ? 100 : speed === 'normal' ? 25 : 10

    return await new Promise(resolve => {
        const tempInterval = setInterval(() => {
            element.text = `${initialNumber} ${text}`
            initialNumber += numberIncrement

            if (initialNumber >= finalNumber) {
                element.text = `${finalNumber.toFixed(0)} ${text}`
                clearInterval(tempInterval)
                resolve(void 0)
            }
        }, intervalSpeed)
    })
}
