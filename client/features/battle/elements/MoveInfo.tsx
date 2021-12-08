import type { CharacterMove } from '@shared'

import type { PixiText } from '@/elementsUtil'
import { Text } from '@/elementsUtil'

export default function (args: { move: CharacterMove; offset: number }): PixiText {
    return Text({
        y: args.offset,
        text: args.move.name,
        anchor: [0, 1],
        style: {
            fontFamily: 'monospace',
            fontSize: 40,
            fontWeight: '900',
            fill: ['#333', '#000'], // gradient
            letterSpacing: -2,
            stroke: '#aaa',
            strokeThickness: 4,
        },
    })
}
