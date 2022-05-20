import type { PixiContainer } from '@/elementsUtil'
import { Container, Text } from '@/elementsUtil'

export function HitInfo(args: { level: number }): PixiContainer {
    return Container({
        children: [
            Text({
                text: `${args.level}`,
                anchor: [0, 0.8],
                x: 250,
                style: {
                    fontFamily: 'monospace',
                    fontSize: 90,
                    fill: ['#82E0AA', '#ffeaab'],
                    dropShadow: true,
                    dropShadowColor: '#eeeeee',
                },
            }),
            Text({
                text: 'LEVEL UP!',
                anchor: [0, 1],
                style: {
                    fontFamily: 'monospace',
                    fontSize: 45,
                    fill: ['#82E0AA', '#ffeaab'],
                    letterSpacing: -1,
                    dropShadow: true,
                    dropShadowColor: '#eeeeee',
                },
            }),
        ],
    })
}
