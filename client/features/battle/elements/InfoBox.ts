import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Text } from '@/elementsUtil'

export default function InfoBox(args: { info: string[] }): PixiContainer {

    const levelNumText = Text({
        text: args.info.join('\n'),
        anchor: [.5, 1],
        style: {
            fontFamily: 'VT323',
            fontSize: 30,
            fill: ['#fff', '#eee'],

            // letterSpacing: -5,
            stroke: '#999',
            strokeThickness: 5,
        },
    })

    const root = Container({
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 8,
        children: [levelNumText],
    })


    return root
}
