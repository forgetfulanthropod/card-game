import { Container, Text } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'
import React from 'react'


// export default Pixi<{ scale: number }, Graphics>('PixiHealthBar', {
//     create: (props) => {

//     },
// })
export default function HitInfo(
    props: {
        damage: number,
    }
): JSX.Element {

    return <Container x={30} y={-200}>
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
