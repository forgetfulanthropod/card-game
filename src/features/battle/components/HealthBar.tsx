import React from 'react'
//@ts-ignore
import styled from 'styled-components'
import healthBorderPng from '../assets/HEALTH_BORDER.png'

const Root = styled.div`
    position: relative;
    width: 8vw;
    user-select: none;
    img {
        width: 103%;
        position: relative;
        left: 0;
        top: 0;
    }
    .bar {
        position: absolute;
        left:0;
        bottom: calc(8vw * 1.4 / 20);
        border-radius: calc(8vw * 3 / 20);
        margin-left: calc(8vw * .3 / 20);
        height: calc(8vw * 1.2 / 20);
    }
    .number {
        font-family: monospace;
        font-size: 2vw;
        letter-spacing: -.2vw;
        line-height: 0;
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
