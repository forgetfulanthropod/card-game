import type { ColorStop } from '@pixi-essentials/gradients'
import { GradientFactory } from '@pixi-essentials/gradients'
import { pick } from 'lodash'
import type { Renderer } from 'pixi.js'
import type { Sprite as PixiSprite } from 'pixi.js'
import { BaseRenderTexture, RenderTexture } from 'pixi.js'

import type { SpriteArgs } from './mypixi'
import { getRenderer, Graphics } from './mypixi'
import { getPixiApp, Sprite } from './mypixi'

export type GradientArgs = {
    x0: number
    y0: number
    x1: number
    y1: number
    colorStops: ColorStop[]
}
export type GradientSpriteArgs = Required<
    Pick<SpriteArgs, 'width' | 'height'>
> &
    Omit<SpriteArgs, 'src'>

export function GradientRectangleSprite(
    options: GradientArgs,
    spriteArgs: GradientSpriteArgs
): PixiSprite {
    const src = GradientFactory.createLinearGradient(
        getPixiApp().renderer as Renderer,
        new RenderTexture(
            new BaseRenderTexture(pick(spriteArgs, 'width', 'height'))
        ),
        options
    )

    return Sprite({ ...spriteArgs, src })
}

// a gradient
export function RoundedRectangleGradientSprite({
    radius,
    gradientArgs,
    spriteArgs,
}: {
    radius: number
    gradientArgs: GradientArgs
    spriteArgs: GradientSpriteArgs
}) {
    return Sprite({
        src: getRenderer().generateTexture(
            Graphics({
                draw(g) {
                    g.beginTextureFill({
                        texture: GradientRectangleSprite(
                            gradientArgs,
                            spriteArgs
                        ).texture,
                    })
                    g.drawRoundedRect(
                        0,
                        0,
                        spriteArgs.width,
                        spriteArgs.height,
                        radius
                    )

                    g.endFill()
                },
            })
        ),
        anchor: spriteArgs.anchor,
    })
}
