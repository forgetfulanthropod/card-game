import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Text } from '@/elementsUtil'

export function BattleRoomInfo(args: { info: string[] }): PixiContainer {
    return Container({
        name: BattleRoomInfo.name,
        x: BASE_WIDTH * 0.95,
        y: BASE_HEIGHT * 0.05,
        children: [
            Text({
                text: args.info.join('\n'),
                anchor: [0.5, 1],
                style: {
                    fontFamily: 'sansFont',
                    fontSize: 30,
                    fill: ['#fff', '#eee'],

                    // letterSpacing: -5,
                    // stroke: '#222',
                    // strokeThickness: 5,
                },
            }),
        ],
    })
}
