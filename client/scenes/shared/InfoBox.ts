import type { ColorStop } from '@pixi-essentials/gradients'
import { omit } from 'lodash'
import type { PixiContainer, ContainerArgs, PixiSprite } from '@/elementsUtil'
import { RoundedRectangleGradientSprite, Container } from '@/elementsUtil'

export function InfoBox(
    contents: PixiContainer,
    displayArgs: ContainerArgs & {
        padding?: number
        colorStops?: ColorStop[]
        borderRadius?: number
        borderThickness?: number
        borderColor?: number
    } = {}
) {
    const localBounds = contents.getLocalBounds()

    const paddingPortion = 0.08

    const padding = displayArgs.padding ?? paddingPortion * localBounds.width

    return Container(
        {
            x: padding,
            ...omit(displayArgs, 'filters', 'colorStops', 'padding'),
        },
        Container(
            { filters: displayArgs.filters },
            ...(displayArgs.borderThickness
                ? [
                      Box(displayArgs, localBounds, padding + 12),
                      Box(
                          {
                              ...displayArgs,
                              colorStops: [
                                  {
                                      color:
                                          displayArgs.borderColor ?? 0xffffff,
                                      offset: 0,
                                  },
                              ],
                          },
                          localBounds,
                          padding + 4
                      ),
                      Box(displayArgs, localBounds, padding),
                  ]
                : [Box(displayArgs, localBounds, padding)])
        ),

        // Sprite({
        //     src: PixiTexture.WHITE,
        //     tint: 0,
        //     width: contents.width * 1.2,
        //     height: contents.height * 1.2,
        //     x: localBounds.left - contents.width * 0.1,
        //     y: localBounds.top - contents.height * 0.1,
        // }),
        contents
    )
}

function Box(
    displayArgs: ContainerArgs & {
        padding?: number | undefined
        colorStops?: ColorStop[] | undefined
        borderRadius?: number | undefined
        borderThickness?: number | undefined
        borderColor?: number | undefined
    },
    localBounds: { height: number; width: number; left: number; top: number },
    padding: number
): PixiSprite {
    return RoundedRectangleGradientSprite({
        radius: displayArgs.borderRadius ?? 20,
        gradientArgs: {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: localBounds.height,
            colorStops: displayArgs.colorStops ?? [
                { color: 0x272753, offset: 0 },
            ],
        },
        spriteArgs: {
            width: localBounds.width + padding * 2,
            height: localBounds.height + padding * 2,
            x: localBounds.left - padding,
            y: localBounds.top - padding,
            filters: displayArgs.filters,
        },
    })
}
