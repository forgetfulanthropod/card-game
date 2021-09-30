import React, { useCallback } from 'react'
import { Graphics as PixiGraphics, TextStyle, utils } from 'pixi.js'
import { Sprite, Container, Graphics, Text } from '@inlet/react-pixi'
import healthBorderPng from '../assets/HEALTH_BORDER.png'


// export default Pixi<{ scale: number }, Graphics>('PixiHealthBar', {
//     create: (props) => {

//     },
// })
export default function HitInfo(
    props: {
        damage: number,
    }
): JSX.Element {

    return <Container x={0} y={0}>
        <Text
            text={`-${props.damage}`}
            anchor={{ x: 0, y: 1 }}
            style={
                new TextStyle({
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
                })
            }
        />
        {/* <Text text="Lo and Behold" /> */}
    </Container>
}
