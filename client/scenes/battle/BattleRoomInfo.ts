import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Text } from '@/elementsUtil'

export function BattleRoomInfo(args: { info: string[] }): PixiContainer {
    return Container({
        name: BattleRoomInfo.name,
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT / 8,
        children: [
            Text({
                text: args.info.join('\n'),
                anchor: [0.5, 1],
                style: {
                    fontFamily: 'bigFont',
                    fontSize: 30,
                    fill: ['#fff', '#eee'],

                    // letterSpacing: -5,
                    stroke: '#999',
                    strokeThickness: 5,
                },
            }),
        ],
    })
}
