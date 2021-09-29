import React, { useCallback } from 'react'
import { Graphics as PixiGraphics } from 'pixi.js'
import { Sprite, Container, Graphics, Text } from '@inlet/react-pixi'


// export default Pixi<{ scale: number }, Graphics>('PixiHealthBar', {
//     create: (props) => {

//     },
// })
export default function PixiHealthBar(
    props: {
        value: number,
        max: number,
        colorStops?: { color: string, stop: number }[],
        numberColor?: string
    }
): JSX.Element {
    const portion = props.value / props.max
    // const width = `${portion * 100}%`
    const width = portion * 100

    const colorStops = props.colorStops ?? [
        { color: 'red', stop: .2 },
        { color: 'goldenrod', stop: .4 },
        { color: 'lightgreen', stop: 1 },
    ]
    const background = ([...colorStops]
        .sort((cs1, cs2) => cs1.stop - cs2.stop)
        .find(cs => portion <= cs.stop) || { color: 'pink' }).color

    const color = props.numberColor ?? background

    const draw = useCallback(function drawHealthBar(g: PixiGraphics) {
        g.clear()
        g.beginFill(0xFF0000)
        g.drawRect(0, 0, width, 20)
        g.endFill()
    }, [width, color, background])

    return <Container x={0} y={10}>
        <Graphics {...{ draw }} />
        {/* <Sprite /> */}
        <Text text="Lo and Behold" />
    </Container>
}
