import type { PixiText} from './mypixi';
import { Text } from './mypixi'

export default function HitInfo(args: { damage: number }): PixiText {
    return Text({
        text: `-${args.damage}`,
        anchor: [0, 1],
        style: {
            fontFamily: 'monospace',
            fontSize: 60,
            //   fontWeight: 400,
            fill: ['#bf040e', '#98040c'], // gradient
            // stroke: '#01d27e',
            // strokeThickness: 5,
            letterSpacing: -5,
            dropShadow: true,
            dropShadowColor: '#eeeeee',
            // dropShadowBlur: 4,
            // dropShadowAngle: Math.PI / 6,
            // dropShadowDistance: 6,
            // wordWrap: true,
            // wordWrapWidth: 440,
        },
    })
}
