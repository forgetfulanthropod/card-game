import React, { useRef } from "react"
import Skeleton from "./assets/Skeleton_Warrior_sprite.png"
import styled from "styled-components"

export default function Fighter(): JSX.Element {
    const ref = useRef<HTMLImageElement>(null)
    return <div>
        {/* <Autoplay width={300} src={Cave} /> */}
        <Shaker ref={ref} src={Skeleton} width={200} />
        <div>
            <button onClick={() => {
                if (ref.current) ref.current.classList.add(".shaker") //TODO
            }}>Punch</button>
            <button onClick={() => { if (ref.current) ref.current.width = 400 }}>Kick</button>
            <button onClick={() => { if (ref.current) ref.current.width = 500 }}>Dodge</button>
        </div>
    </div>
}

const Shaker = styled.img`
    &:hover {
        /* Start the shake animation and make the animation last for 0.5 seconds */
        animation: shake 0.5s;
        /* When the animation is finished, start again */
        animation-iteration-count: infinite;
    }

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
