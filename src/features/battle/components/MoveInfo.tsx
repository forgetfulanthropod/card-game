import { Text } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'
import React from 'react'

export default function HitInfo(
    props: {
        move: MoveMeta,
        offset: number,
    }
): JSX.Element {

    return <Text
        y={props.offset}
        text={props.move.name}
        anchor={{ x: 0, y: 1 }}
        style={
            new TextStyle({
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
            })
        }
    />
}
