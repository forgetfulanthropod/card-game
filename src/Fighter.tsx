import React, { useEffect, useState } from "react"
import styled from "styled-components"
import skeletonPng from "./assets/Skeleton_Warrior_sprite.png"
import startPng from "./assets/start.png"

export default function Fighter(): JSX.Element {
    const [shake, setShake] = useState(false)
    const [width, setWidth] = useState(200)
    useEffect(() => {
        const t = setTimeout(() => setShake(false), 500)
        return () => clearTimeout(t)
    }, [shake])
    return <div>
        <Start />
        <Skeleton shake={shake} width={width} />
        <div>
            <button onClick={() => setShake(true)}>Punch</button>
            <button onClick={() => setWidth(400)}>Kick</button>
            <button onClick={() => setWidth(500)}>Dodge</button>
        </div>
    </div>
}

const Start = styled.img.attrs({ src: startPng })`
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20%;
    left: 50%;
    top: 25%;
`

const Skeleton = styled.img.attrs({ src: skeletonPng }) <{ shake: boolean }>`
    ${p => p.shake && "animation: shake 0.5s;"}

    @keyframes shake {
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
    }
`
