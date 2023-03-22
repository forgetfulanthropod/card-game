import { PixiContainer, RoundedRectangleGradientSprite } from '@/elementsUtil'
import { Container, PixiTexture, Sprite, Text } from '@/elementsUtil'

export function PlainButton(args: {
    text: string
    onClick: Callback
    fontSize?: number
    x?: number
    y?: number
    width?: number
}): PixiContainer {
    const { fontSize = 30, x, y, width, onClick } = args
    const text = Text({
        text: args.text,
        style: { fontSize, fill: 'white' },
        x,
        y,
        width,
    })
    const bgWidth = text.width + text.height
    const bgHeight = text.height * 1.5
    const bg = RoundedRectangleGradientSprite({
        spriteArgs: {
            width: bgWidth,
            height: bgHeight,
            x: text.x - (bgWidth - text.width) / 2,
            y: text.y - (bgHeight - text.height) / 2,
        },
        radius: 20,
        gradientArgs: {
            x0: 0,
            y0: 0,
            x1: bgWidth,
            y1: bgHeight,
            colorStops: [
                {
                    color: 0xff0000,
                    offset: 0,
                },
                {
                    color: 0x00ff00,
                    offset: 0.5,
                },
                {
                    color: 0x0000ff,
                    offset: 1,
                },
            ],
        },
    })
    return Container(
        {
            name: 'PlainButton',
            onClick,
        },
        bg,
        text
    )
}
