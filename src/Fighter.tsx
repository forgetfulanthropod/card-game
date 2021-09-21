import React from "react"

import Skeleton from "assets/Skeleton_Warrior_sprite.png"

export default function Fighter(): JSX.Element {
    const ref = React.useRef<HTMLImageElement>()
    return <div>
        <img ref={ref} src={Skeleton} width={200} />
        <div>
            <button onClick={() => { if (ref.current) ref.current.width = 300 }}>Punch</button>
            <button onClick={() => { if (ref.current) ref.current.width = 400 }}>Kick</button>
            <button onClick={() => { if (ref.current) ref.current.width = 500 }}>Dodge</button>
        </div>
    </div>
}
