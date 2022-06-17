import type { PixiContainer } from '@/elementsUtil'
import { RoundedRectangleGradientSprite, Container } from '@/elementsUtil'
import type { DisplayObjectArgs } from '@/elementsUtil/mypixi/_types'

export function InfoBox(
    contents: PixiContainer,
    displayArgs: DisplayObjectArgs = {}
) {
    const localBounds = contents.getLocalBounds()

    const marginPortion = 0.08

    return Container({
        children: [
            RoundedRectangleGradientSprite({
                radius: 20,
                gradientArgs: {
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: localBounds.height,
                    colorStops: [
                        { color: 0x111111, offset: 0 },
                        { color: 0x33_33_33, offset: 1 },
                    ],
                },
                spriteArgs: {
                    width: localBounds.width * (1 + marginPortion * 2),
                    height:
                        localBounds.height +
                        localBounds.width * marginPortion * 2, // even margin all around
                    x: localBounds.left - localBounds.width * marginPortion,
                    y: localBounds.top - localBounds.width * marginPortion,
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
            contents,
        ],
        ...displayArgs,
    })
}
