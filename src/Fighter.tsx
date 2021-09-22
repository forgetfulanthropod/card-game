import React, { useRef } from "react"
import Cave from './assets/cave_main_1.mp4'
import Skeleton from "./assets/Skeleton_Warrior_sprite.png"
import styles from "./Fighter.module.css"


export default function Fighter(): JSX.Element {
    const ref = useRef<HTMLImageElement>(null)
    return <div>
        <Autoplay width={300} src={Cave} />
        <img ref={ref} src={Skeleton} width={200} className={styles.shaker} />
        <div>
            <button onClick={() => {
                if (ref.current) ref.current.classList.add(".shaker") //TODO
            }}>Punch</button>
            <button onClick={() => { if (ref.current) ref.current.width = 400 }}>Kick</button>
            <button onClick={() => { if (ref.current) ref.current.width = 500 }}>Dodge</button>
        </div>
    </div>
}

function Autoplay(props: { width: number, src: string, type?: string }) {
    const type = props.type ?? "video/mp4"
    return <video autoPlay muted loop width={props.width}>
        <source src={props.src} type={type} />
    </video>
}
