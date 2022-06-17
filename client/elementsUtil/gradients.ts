import type { ColorStop } from '@pixi-essentials/gradients'
import { GradientFactory } from '@pixi-essentials/gradients'
import type { Renderer, Sprite as PixiSprite } from 'pixi.js'
import { BaseRenderTexture, RenderTexture } from 'pixi.js'
import { assertFinite } from 'shared/code'

import type { SpriteArgs } from './mypixi'
import {
    PixiTexture,
    PixiGraphics,
    getRenderer,
    getPixiApp,
    Sprite,
} from './mypixi'

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
    const { width, height } = spriteArgs
    assertFinite({ width, height })
    const texture = new RenderTexture(new BaseRenderTexture({ width, height }))

    let src

    try {
        if (options.r0 != null && options.r1 != null)
            src = GradientFactory.createRadialGradient(
                renderer,
                texture,
                //@ts-expect-error
                options
            )
        else
            src = GradientFactory.createLinearGradient(
                renderer,
                texture,
                options
            )
    } catch (e) {
        src = PixiTexture.WHITE
    }
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
