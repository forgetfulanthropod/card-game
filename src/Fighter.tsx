import React, { useEffect, useState } from "react"
import styled, { keyframes, css } from "styled-components"
import skeletonPng from "./assets/Skeleton_Warrior_sprite-200.png"
import frogknightPng from "./assets/Frog_Knight_sprite-200.png"
import startPng from "./assets/start.png"


const skeletonPositions = makePositions(70, 35, 18, 15)
const frogknightPositions = makePositions(10, 35, 18, 15)
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

export default function Fighter(): JSX.Element {
    // const [width, setWidth] = useState(200)
    return <div>
        <Start />
        {skeletonPositions.map(([x, y]) =>
            <Character key={x + y} x={x} y={y} Thing={SkeletonImg} direction={1} />)}
        {frogknightPositions.map(([x, y]) =>
            <Character key={x + y} x={x} y={y} Thing={FrognightImg} direction={-1} />)}
        {/* <div>
            <button onClick={() => setShake(true)}>Punch</button>
            <button onClick={() => setWidth(400)}>Kick</button>
            <button onClick={() => setWidth(500)}>Dodge</button>
        </div> */}
    </div>
}

function Character(props: { x: number, y: number, Thing: typeof Sprite, direction: -1 | 1 }): JSX.Element {
    const Thing = props.Thing
    const [hasEffect, setHasEffect] = useState(false)
    useEffect(() => {
        if (!hasEffect) return () => { }
        const t = setTimeout(() => setHasEffect(false), 500)
        return () => clearTimeout(t)
    }, [hasEffect])
    return <div onClick={() => setHasEffect(true)}>
        {hasEffect
            ?
            <>
                <Thing shake={hasEffect} x={props.x + .5 * props.direction} y={props.y} blur={true} />
                <Thing shake={hasEffect} x={props.x} y={props.y} color="red" />
            </>
            :
            <Thing shake={hasEffect} x={props.x} y={props.y} />
        }

    </div>
}

const Start = styled.img.attrs({ src: startPng })`
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20%;
    left: 50%;
    top: 25%;
`


const Sprite = styled.img.attrs({ src: skeletonPng, width: 200 })
    <{ shake: boolean, x: number, y: number, color?: string, blur?: boolean }>`
    ${p => p.shake && css`animation: ${shake} 0.5s;`}

    position: absolute;
    left: ${p => p.x}%;
    top: ${p => p.y}%;
    width: 200px;
    ${p => p.blur === true && `filter: blur(2px);`}
    ${p => p.color != null && css`
        filter: opacity(0.5) drop-shadow(0 0 0 ${p.color});
    `}
    /* box-shadow: 5px 6px 7px black; */
`
const FrognightImg = styled(Sprite).attrs({ src: frogknightPng, width: 200 })``
const SkeletonImg = styled(Sprite).attrs({ src: skeletonPng })``


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
