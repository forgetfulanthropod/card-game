import type { PixiText } from '@/elementsUtil'
import { Text } from '@/elementsUtil'

export function MoveInfo(args: { moveName: string; offset: number }): PixiText {
    return Text({
        y: args.offset,
        text: args.moveName,
        anchor: [0, 1],
        style: {
            fontFamily: ['bigFont', 'monospace'],
            fontSize: 40,
            fontWeight: '900',
            fill: ['#333', '#000'], // gradient
            letterSpacing: -2,
            stroke: '#aaa',
            strokeThickness: 4,
        },
    })
}
