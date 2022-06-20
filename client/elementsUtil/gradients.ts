import type { ColorStop } from '@pixi-essentials/gradients'
import { GradientFactory } from '@pixi-essentials/gradients'
import type { Renderer, Sprite as PixiSprite } from 'pixi.js'
import { BaseRenderTexture, RenderTexture } from 'pixi.js'
import { assertFinite } from 'shared/code'
import { deepEqual } from 'fast-equals'
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
    const { width, height } = spriteArgs
    assertFinite({ width, height })
    const texture = new RenderTexture(new BaseRenderTexture({ width, height }))

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

const rrgsMemo: [RRGSProps, RenderTexture][] = []

type RRGSProps = {
    radius: number
    gradientArgs: GradientArgs
    spriteArgs: GradientSpriteArgs
}

// a gradient inside of a rounded corner rectangle
export function RoundedRectangleGradientSprite(props: RRGSProps): PixiSprite {
    const cached = rrgsMemo.find(([args, _texture]) =>
        deepEqual(args, props)
    )?.[1]
    if (cached)
        return Sprite({
            src: cached,
            ...props.spriteArgs,
        })

    const { radius, gradientArgs, spriteArgs } = props

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
    rrgsMemo.push([props, texture])
    // console.log(`there are now ${rrgsMemo.length} rrgs in the memo`)
    g.destroy(true)
    subSprite.destroy(true)
    return Sprite({
        src: texture,
        ...spriteArgs,
        // onDestroy: [() => texture.destroy(true)],
    })
}
