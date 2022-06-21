import type { ColorStop } from '@pixi-essentials/gradients'
import { omit } from 'lodash'
import type { PixiContainer, ContainerArgs } from '@/elementsUtil'
import { RoundedRectangleGradientSprite, Container } from '@/elementsUtil'

export function InfoBox(
    contents: PixiContainer,
    displayArgs: ContainerArgs & {
        padding?: number
        colorStops?: ColorStop[]
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
        RoundedRectangleGradientSprite({
            radius: 20,
            gradientArgs: {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: localBounds.height,
                colorStops: displayArgs.colorStops ?? [
                    { color: 0x111111, offset: 0 },
                    { color: 0x33_33_33, offset: 1 },
                ],
            },
            spriteArgs: {
                width: localBounds.width + padding * 2,
                height: localBounds.height + +padding * 2, // even padding all around
                x: localBounds.left - padding,
                y: localBounds.top - padding,
                filters: displayArgs.filters,
            },
        }),
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
