import type { PixiContainer } from '@/features/battle/elements/mypixi'
import { Container, PixiTexture, Sprite, Text } from '@/features/battle/elements/mypixi'

export default function PlainButton(args: { text: string, onClick: Callback, fontSize?: number, x?: number, y?: number, width?: number }): PixiContainer {
    const { fontSize = 30, x, y, width, onClick } = args
    const text = Text({
        text: args.text,
        onClick,
        style: { fontSize },
        x,
        y,
        width,
    })
    const bg = Sprite({
        src: PixiTexture.WHITE,
        width: text.width * 1.2,
        height: text.height * 1.1,
        x: text.x - text.width * 0.1,
        y: text.y - text.height * 0.1,
    })
    return Container({
        name: 'PlanButton',
        children: [
            bg,
            text,
        ],
    })
}
