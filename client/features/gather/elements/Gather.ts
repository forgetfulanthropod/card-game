import type { PixiContainer } from '@/elementsUtil'
import { Container, PixiTexture, Sprite } from '@/elementsUtil'

export function Gather(): PixiContainer {
    return Container({
        children: [
            Sprite({
                src: PixiTexture.WHITE,
                onClick: () => alert('clicked'),
                width: 300,
                height: 500,
                x: 700,
                y: 200,
            }),
        ],
    })
}
