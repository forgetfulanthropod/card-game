import { Text, PixiText } from './mypixi'

export default function (args: {
    move: MoveMeta,
    offset: number,
}
): PixiText {

    return Text({
        y: args.offset,
        text: args.move.name,
        anchor: [0, 1],
        style: {
            fontFamily: 'monospace',
            fontSize: 40,
            fontWeight: '900',
            fill: ['#333', '#000'], // gradient
            // stroke: '#01d27e',
            // strokeThickness: 5,
            letterSpacing: -2,
            stroke: '#aaa',
            strokeThickness: 4,
            // dropShadowDistance: 6,
            // wordWrap: true,
            // wordWrapWidth: 440,
        },
    })
}
