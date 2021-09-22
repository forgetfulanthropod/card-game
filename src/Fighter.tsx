import React, { useEffect, useState } from "react"
import styled, { keyframes, css } from "styled-components"
import skeletonPng from "./assets/Skeleton_Warrior_sprite.png"
import startPng from "./assets/start.png"


const positions = makePositions()

function makePositions(): [number, number][] {
    const hGap = 18
    const vGap = 15
    const [x0, y0] = [70, 35]
    return [
        [x0, y0],
        [x0 + hGap, y0],
        [x0 - hGap / 2, y0 + vGap],
        [x0 + hGap / 2, y0 + vGap],
        [x0, y0 + vGap * 2],
        [x0 + hGap, y0 + vGap * 2],
    ]//.map(([x, y]) => [x + "%", y + "%"])
}

export default function Fighter(): JSX.Element {
    // const [width, setWidth] = useState(200)
    return <div>
        <Start />
        {positions.map(([x, y]) =>
            <Skeleton key={x + y} x={x} y={y} />)}
        {/* <div>
            <button onClick={() => setShake(true)}>Punch</button>
            <button onClick={() => setWidth(400)}>Kick</button>
            <button onClick={() => setWidth(500)}>Dodge</button>
        </div> */}
    </div>
}

function Skeleton(props: { x: number, y: number }) {
    const [shake, setShake] = useState(false)
    useEffect(() => {
        if (!shake) return () => { }
        const t = setTimeout(() => setShake(false), 500)
        return () => clearTimeout(t)
    }, [shake])

    return <div>
        <SkeletonImg shake={shake} x={props.x + .3} y={props.y} color="red" />
        <SkeletonImg shake={shake} x={props.x + .6} y={props.y} blur={true} />
        <SkeletonImg shake={shake} x={props.x} y={props.y} onClick={() => setShake(true)} />
    </div>
}

const Start = styled.img.attrs({ src: startPng })`
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20%;
    left: 50%;
    top: 25%;
`

const SkeletonImg = styled.img.attrs({ src: skeletonPng, width: 200 })
    <{ shake: boolean, x: number, y: number, color?: string, blur?: boolean }>`
    ${p => p.shake && css`animation: ${shake} 0.5s;`}

    position: absolute;
    left: ${p => p.x}%;
    top: ${p => p.y}%;
    width: 200px;
    ${p => p.blur === true && `filter: blur(2px);`}
    ${p => p.color != null && css`filter: opacity(0.5) drop-shadow(0 0 0 ${p.color});`}
    /* box-shadow: 5px 6px 7px black; */
`

const shake = keyframes`
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
`
