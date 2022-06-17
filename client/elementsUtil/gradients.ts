import type { ColorStop } from '@pixi-essentials/gradients'
import { GradientFactory } from '@pixi-essentials/gradients'
import type { Renderer, Sprite as PixiSprite } from 'pixi.js'
import { BaseRenderTexture, RenderTexture } from 'pixi.js'
import { assertFinite } from 'shared/code'

import type { PixiContainer, SpriteArgs } from './mypixi'
import {
    Container,
    PixiGraphics,
    getRenderer,
    getPixiApp,
    Sprite,
} from './mypixi'
import { nextTick } from '@/util'

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

async function GradientRectangleSprite(
    options: GradientArgs,
    spriteArgs: GradientSpriteArgs
): Promise<PixiSprite> {
    const renderer = getPixiApp().renderer as Renderer
    const { width, height } = spriteArgs
    assertFinite({ width, height })
    const texture = new RenderTexture(new BaseRenderTexture({ width, height }))
    await nextTick()

    const src =
        options.r0 != null && options.r1 != null
            ? GradientFactory.createRadialGradient(
                  renderer,
                  texture,
                  //@ts-expect-error
                  options
              )
            : GradientFactory.createLinearGradient(renderer, texture, options)
    return Sprite({ ...spriteArgs, src })
}

// a gradient inside of a rounded corner rectangle
export function RoundedRectangleGradientSprite({
    radius,
    gradientArgs,
    spriteArgs,
    onLoaded = () => {},
}: {
    radius: number
    gradientArgs: GradientArgs
    spriteArgs: GradientSpriteArgs
    onLoaded?: Callback
}): PixiContainer {
    const root = Container({})
    void GradientRectangleSprite(gradientArgs, spriteArgs).then(subSprite => {
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
        void nextTick().then(() => {
            g.destroy(true)
            subSprite.destroy(true)
            root.addChild(
                Sprite({
                    src: texture,
                    ...spriteArgs,
                    onDestroy: [
                        () => {
                            texture.destroy(true)
                        },
                    ],
                })
            )
            onLoaded()
        })
    })
    return root
}
