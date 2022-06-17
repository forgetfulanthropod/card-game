import type { PixiText } from '@/elementsUtil'
import { Text } from '@/elementsUtil'

export function HitInfo(args: {
    damage: number | string
    isPoison?: boolean
}): PixiText {
    return Text({
        text: `-${args.damage}`,
        anchor: [0, 1],
        style: {
            fontFamily: ['bigFont', 'monospace'],
            fontSize: 60,
            fill: args.isPoison
                ? ['rgb(143,253,49)', 'rgb(43,148,52)']
                : ['#D74222', '#d66249'], // gradient
            letterSpacing: -5,
            dropShadow: true,
            dropShadowColor: '#eeeeee',
        },
    })
}
