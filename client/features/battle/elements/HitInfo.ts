import type { PixiText } from '@/elementsUtil'
import { Text } from '@/elementsUtil'

export default function HitInfo(args: { damage: number | string, isPoison?: boolean }): PixiText {
    return Text({
        text: `-${args.damage}`,
        anchor: [0, 1],
        style: {
            fontFamily: 'monospace',
            fontSize: 60,
            fill: args.isPoison ? ['rgb(143,253,49)', 'rgb(43,148,52)'] : ['#bf040e', '#98040c'], // gradient
            letterSpacing: -5,
            dropShadow: true,
            dropShadowColor: '#eeeeee',
        },
    })
}
