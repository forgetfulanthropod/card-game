import React from 'react'
import styled from 'styled-components'
import healthBorderPng from '../assets/HEALTH_BORDER.png'

const Root = styled.div`
    position: relative;
    width: 20vw;
    user-select: none;
    img {
        width: 103%;
        position: relative;
        /* position: absolute; */
        /* top: 0; */
        /* left: 0; */
    }
    .bar {
        position: absolute;
        left:0;
        bottom: .7vw;
        border-radius: 3vw;
        margin-left: .3vw;
        height: 1.2vw;
    }
    .number {
        font-family: monospace;
        font-size: 3vw;
        left: 0;
        letter-spacing: -.2vw;
    }
`

export default function HealthBar(props: { value: number, max: number, colorStops?: { color: string, stop: number }[], numberColor?: string }): JSX.Element {
    const portion = props.value / props.max
    const width = `${portion * 100}%`

    const colorStops = props.colorStops ?? [
        { color: 'red', stop: .2 },
        { color: 'goldenrod', stop: .4 },
        { color: 'lightgreen', stop: 1 },
    ]
    const background = ([...colorStops]
        .sort((cs1, cs2) => cs1.stop - cs2.stop)
        .find(cs => portion <= cs.stop) || { color: 'pink' }).color

    const color = props.numberColor ?? background
    return <Root>

        <div className="number" style={{ color }}>{props.value}</div>
        <div className="bar" style={{ width, background }}></div>
        <img src={healthBorderPng} alt="health border" />
    </Root>
}
