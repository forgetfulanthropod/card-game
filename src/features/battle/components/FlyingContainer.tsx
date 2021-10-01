import { Container, useApp as usePixiApp } from '@inlet/react-pixi'
import { Container as PixiContainer } from 'pixi.js'
import React, { useEffect, useState } from 'react'
import { Start } from './Styles'



const FLY_TIME = 800
const FLY_TO_TIME = FLY_TIME * .6
const FLY_BACK_TIME = FLY_TIME - FLY_TO_TIME

export default function FlyingContainer(
    props: {
        children: Children,
        scale: number,
        start: { x: number, y: number },
        flyTo?: { x: number, y: number },
    }
): JSX.Element {

    const [ref, setRef] = useState<PixiContainer | null>(null)

    const { ticker } = usePixiApp()

    const { x: flyToX = 1, y: flyToY = 1 } = props.flyTo ?? {}
    const { x: startX, y: startY } = props.start
    useEffect(() => {
        if (ref == null) return () => { }

        ref.x = props.start.x
        ref.y = props.start.y

        if (
            props.flyTo == null ||
            props.start == null ||
            ticker == null
        ) return () => { }

        const flyTo = props.flyTo
        const start = props.start
        // console.log('starting animation', { flyTo, start })
        let timeElapsed = 0
        const fly = (elapsed: number) => {
            // const deltaTimeMs = elapsed * 1000 / 60
            timeElapsed += elapsed * 16.66
            let x: number, y: number
            if (timeElapsed < FLY_TO_TIME) {
                x = start.x + (flyTo.x - start.x) * timeElapsed / FLY_TO_TIME
                y = start.y + (flyTo.y - start.y) * timeElapsed / FLY_TO_TIME
            } else if (timeElapsed < FLY_TIME) {
                x = flyTo.x + (start.x - flyTo.x) * (timeElapsed - FLY_TO_TIME) / FLY_BACK_TIME
                y = flyTo.y + (start.y - flyTo.y) * (timeElapsed - FLY_TO_TIME) / FLY_BACK_TIME
            } else {
                x = start.x
                y = start.y
                ticker.remove(fly)
            }

            ref.x = x
            ref.y = y
        }
        ticker.add(fly)

        return () => ticker.remove(fly)
    }, [flyToX, flyToY, startX, startY, ref, ticker])

    return <Container ref={r => setRef(r)} scale={props.scale}>
        {props.children}
    </Container>
}
