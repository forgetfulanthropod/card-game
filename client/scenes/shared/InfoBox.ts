import type { PixiContainer } from '@/elementsUtil'
import { RoundedRectangleGradientSprite, Container } from '@/elementsUtil'

export function InfoBox(contents: PixiContainer) {
    const localBounds = contents.getLocalBounds()

    return Container({
        children: [
            RoundedRectangleGradientSprite({
                radius: 20,
                gradientArgs: {
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: contents.height,
                    colorStops: [
                        { color: 0x111111, offset: 0 },
                        { color: 0x33_33_33, offset: 1 },
                    ],
                },
                spriteArgs: {
                    width: contents.width * 1.2,
                    height: contents.height * 1.2,
                    x: localBounds.left - contents.width * 0.1,
                    y: localBounds.top - contents.height * 0.1,
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
    })
}
