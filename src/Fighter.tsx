import React from "react"
import styles from "./Fighter.module.css"
import Skeleton from "./assets/Skeleton_Warrior_sprite.png"

export default function Fighter(): JSX.Element {
    const ref = React.useRef<HTMLImageElement>(null)
    return <div>
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
