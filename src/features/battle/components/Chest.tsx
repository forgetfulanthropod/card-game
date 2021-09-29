import React, { useCallback, useEffect } from 'react'
import {
    Application,
    Container,
    Texture,
    Sprite,
    ObservablePoint,
    Graphics,
} from 'pixi.js'
//@ts-ignore
import styled from 'styled-components'
import chestBodyPng from '../assets/CHEST_BODY.png'
import chestLidPng from '../assets/CHEST_LID.png'
import { Stage, useTick } from '@inlet/react-pixi'

// const Chest = PixiComponent<{ scale: number }, Sprite>('PixiBackground', {
//     create: (props) => {
//     },
// })
// export default Chest


function foo(canvas: HTMLCanvasElement) {
    const app = new Application({
        view: canvas,
        // width: 800,
        // height: 600,
        // backgroundColor: 0x1099bb,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
    })

    const container = new Container()


    app.stage.addChild(container)

    const body = Sprite.from(chestBodyPng)
    const lid = Sprite.from(chestLidPng)
    body.scale.set(.3, .3)
    lid.scale.set(.3, .3)
    container.addChild(body)
    container.addChild(lid)
    // // ~~Move container to the center~~
    // container.x = app.screen.width / 2
    // container.y = app.screen.height / 2
    container.x = 300
    container.y = 300

    // // Center bunny sprite in local container coordinates
    // container.pivot.x = container.width / 2
    // container.pivot.y = container.height / 2

    // lid.pivot.x = lid.width + lid.x
    // lid.pivot.y = lid.height + lid.y
    const lidWidth = app.screen.width * lid.width
    const lidHeight = app.screen.width * lid.width
    console.log("lidWidth:", lidWidth)
    lid.pivot.x = lidWidth
    lid.pivot.y = lidHeight
    // lid.anchor.x += lidWidth
    // lid.anchor.y += lidHeight

    const rotation_rate = 1.0
    lid.angle = 90
    const graphics = new Graphics()
    graphics.beginFill(0x9b59b6) // Purple
    console.log("lid.pivot.x, lid.pivot.y", lid.pivot.x, lid.pivot.y)
    graphics.drawCircle(lid.pivot.x, lid.pivot.y, 15)
    graphics.endFill()
    graphics.beginFill(0xFFFF00) // Purple
    graphics.drawCircle(lid.anchor.x, lid.anchor.y, 15)
    graphics.endFill()
    container.addChild(graphics)
    // Listen for animate update
    // app.ticker.add((delta) => {
    //     // rotate the container!
    //     // use delta to create frame-independent transform
    //     lid.angle = Math.min(lid.angle + rotation_rate * delta, 90)
    // })
    return app
}

export default function Chest(props: { size: SizeQ }): JSX.Element {
    const { width = 1920, height = 1080 } = props.size
    // const [angle, setAngle] = useState(0)
    // useTick(delta => setAngle(a=>a+delta))

    const onRef = useCallback((node): null | Callback => {
        if (node == null) return null
        const app = foo(node)
        return () => { app.destroy() }
    }, [])
    return <Canvas ref={onRef} width={width} height={height} />
}

const Canvas = styled.canvas`
    width: 100%;
    height: 100%;
    /* width: 50%;
    height: 50%;
    left: 25%;
    top: 25%; */
    position: absolute;
`
