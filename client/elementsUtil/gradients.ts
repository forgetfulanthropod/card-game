import type { ColorStop } from '@pixi-essentials/gradients'
import { GradientFactory } from '@pixi-essentials/gradients'
import { pick } from 'lodash'
import type { Renderer, Sprite as PixiSprite } from 'pixi.js'
import { BaseRenderTexture, RenderTexture } from 'pixi.js'

import type { SpriteArgs } from './mypixi'
import { PixiGraphics, getRenderer, getPixiApp, Sprite } from './mypixi'

export type GradientArgs = {
    x0: number
    y0: number
    x1: number
    y1: number
    r0?: number
    r1?: number
    colorStops: ColorStop[]
}
export type GradientSpriteArgs = Required<
    Pick<SpriteArgs, 'width' | 'height'>
> &
    Omit<SpriteArgs, 'src'>

function GradientRectangleSprite(
    options: GradientArgs,
    spriteArgs: GradientSpriteArgs
): PixiSprite {
    const renderer = getPixiApp().renderer as Renderer
    const texture = new RenderTexture(
        new BaseRenderTexture(pick(spriteArgs, 'width', 'height'))
    )

    let src

    if (options.r0 != null && options.r1 != null)
        //@ts-expect-error
        src = GradientFactory.createRadialGradient(renderer, texture, options)
    else src = GradientFactory.createLinearGradient(renderer, texture, options)

    return Sprite({ ...spriteArgs, src })
}

// a gradient inside of a rounded corner rectangle
export function RoundedRectangleGradientSprite({
    radius,
    gradientArgs,
    spriteArgs,
}: {
    radius: number
    gradientArgs: GradientArgs
    spriteArgs: GradientSpriteArgs
}): PixiSprite {
    const subSprite = GradientRectangleSprite(gradientArgs, spriteArgs)
    const g = new PixiGraphics()
    g.beginTextureFill({
        texture: subSprite.texture,
    })
    if (radius >= Math.max(spriteArgs.width, spriteArgs.height) / 2) {
        g.drawCircle(radius, radius, radius)
    } else {
        g.drawRoundedRect(0, 0, spriteArgs.width, spriteArgs.height, radius)
    }

    g.endFill()
    const texture = getRenderer().generateTexture(g)
    g.destroy(true)
    subSprite.destroy(true)
    return Sprite({
        src: texture,
        ...spriteArgs,
        onDestroy: [() => texture.destroy(true)],
    })
}
