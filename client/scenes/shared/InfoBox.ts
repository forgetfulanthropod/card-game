import { PixiContainer } from '@/elementsUtil'
import { Container, PixiTexture, Sprite } from '@/elementsUtil'

export function InfoBox(contents: PixiContainer) {
    const localBounds = contents.getLocalBounds()

    return Container({
        children: [
            Sprite({
                src: PixiTexture.WHITE,
                tint: 0,
                width: contents.width * 1.2,
                height: contents.height * 1.2,
                x: localBounds.left - contents.width * 0.1,
                y: localBounds.top - contents.height * 0.1,
            }),
            contents,
        ],
    })
}
