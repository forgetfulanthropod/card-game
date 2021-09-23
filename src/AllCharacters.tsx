import React, { useEffect, useRef, useState } from "react"
import styled, { keyframes, css } from "styled-components"
import skeletonPng from "./assets/Skeleton_Warrior_sprite-200.png"
import frogknightPng from "./assets/Frog_Knight_sprite-200.png"
import startPng from "./assets/start.png"


const skeletonPositions = makePositions(70, 25, 18, 15)
const frogknightPositions = makePositions(10, 25, 18, 15)
function makePositions(x0: number, y0: number, hGap: number, vGap: number): [number, number][] {
    return [
        [x0, y0],
        [x0 + hGap, y0],
        [x0 - hGap / 2, y0 + vGap],
        [x0 + hGap / 2, y0 + vGap],
        [x0, y0 + vGap * 2],
        [x0 + hGap, y0 + vGap * 2],
    ]
}

export default function AllCharacters(): JSX.Element {
    // const [width, setWidth] = useState(200)
    return <div>
        <Start />
        {skeletonPositions.map(([x, y]) =>
            <Skeleton key={x + y} x={x} y={y} />)}
        {frogknightPositions.map(([x, y]) =>
            <Frogknight key={x + y} x={x} y={y} />)}
        {/* <div>
            <button onClick={() => setShake(true)}>Punch</button>
            <button onClick={() => setWidth(400)}>Kick</button>
            <button onClick={() => setWidth(500)}>Dodge</button>
        </div> */}
    </div>
}

function Frogknight(props: { x: number, y: number }) {
    return <Character x={props.x} y={props.y} src={frogknightPng} direction={-1} color="green" />
}

function Skeleton(props: { x: number, y: number }) {
    return <Character x={props.x} y={props.y} src={skeletonPng} direction={-1} color="red" />
}

function Character(props: { x: number, y: number, src: string, direction: -1 | 1, color: string }): JSX.Element {
    const [health, setHealth] = useState(~~(Math.random() * 100) + 1)
    const [hasEffect, setHasEffect] = useState(false)
    useEffect(() => {
        if (!hasEffect) return () => { }
        const t = setTimeout(() => setHasEffect(false), 500)
        return () => clearTimeout(t)
    }, [hasEffect])
    const ref = useRef(null)

    return <>
        {health > 0 ?
            <div onClick={() => { setHasEffect(true); setHealth(h => h - ~~(Math.random() * 10)) }}
                style={{ position: 'absolute', left: props.x + '%', top: props.y + '%', width: '13%' }}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%', }}>
                    {hasEffect
                        ?
                        <>
                            <Sprite ref={ref} src={props.src} shake={hasEffect} x={5} y={0} blur={true} />
                            <Sprite src={props.src} shake={hasEffect} x={5} y={0} absolute={true} color="red" blur={true} />
                        </>
                        :
                        <Sprite ref={ref} src={props.src} shake={hasEffect} x={0} y={0} />
                    }
                    <Health color={props.color}>{health}</Health>
                    {/* <Health x={size?.width == null ? 10 : size.width / 2} y={size?.height == null ? 10 : size.height} color={props.color}>{health}</Health> */}
                </div>
            </div> :
            <></>}
    </>
}

const Health = styled.div<{ color: string }>`
    font-family: monospace;
    font-weight: bold;
    position: absolute;
    /* position: relative; */
    font-size: 4vw;
    color: ${p => p.color};
    left: 50%;
    transform: translateX(-50%) translateY(-15%);
    /* top: ${p => p.y}px; */
`

const Start = styled.img.attrs({ src: startPng })`
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20%;
    left: 50%;
    top: 25%;
`


const Sprite = styled.img.attrs({ width: 200 })
    <{ shake: boolean, x: number, y: number, color?: string, blur?: boolean, absolute?: boolean }>`
    ${p => p.shake && css`animation: ${shake} 0.5s;`}
    user-select: none;
    position: ${p => p.absolute === true ? 'absolute' : 'relative'};
    left: ${p => p.x}%;
    top: ${p => p.y}%;
    width: 100%;
    ${p => p.blur === true && `filter: blur(2px);`}
    ${p => p.color != null && css`
        filter: opacity(0.5) drop-shadow(0 0 0 ${p.color});
    `}
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
