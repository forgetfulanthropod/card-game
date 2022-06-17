import type { PixiContainer } from '@/elementsUtil'
import { BASE_WIDTH, Container, Text } from '@/elementsUtil'

export function BattleRoomInfo(args: { info: string[] }): PixiContainer {
    return Container({
        name: BattleRoomInfo.name,
        x: BASE_WIDTH * 0.95,
        y: BASE_WIDTH * 0.02,
        children: [
            Text({
                text: args.info.join('\n'),
                anchor: [1, 0],
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
