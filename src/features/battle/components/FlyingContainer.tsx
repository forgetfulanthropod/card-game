import { Container, render, useApp as usePixiApp } from '@inlet/react-pixi'
import { Container as PixiContainer, Ticker } from 'pixi.js'
import React, { useEffect } from 'react'


let x: number, y: number
let start: { x: number, y: number }
let stage: PixiContainer
let ticker: Ticker
let children: Children

const FLY_TIME = 800
const FLY_TO_TIME = FLY_TIME * .6
const FLY_BACK_TIME = FLY_TIME - FLY_TO_TIME

const flyTo = (flyToCoords: { x: number, y: number }): () => void => {

    const fly = (elapsed: number) => {
        if (elapsed < FLY_TO_TIME) {
            x = start.x + (flyToCoords.x - start.x) * elapsed / FLY_TO_TIME
            y = start.y + (flyToCoords.y - start.y) * elapsed / FLY_TO_TIME
        } else {
            x = flyToCoords.x + (start.x - flyToCoords.x) * (elapsed - FLY_TO_TIME) / FLY_BACK_TIME
            y = flyToCoords.y + (start.y - flyToCoords.y) * (elapsed - FLY_TO_TIME) / FLY_BACK_TIME
        }

        console.log('rendering at ', x, y)
        render(<FlyingContainer />, stage)
    }
    ticker.add(fly)

    return () => ticker.remove(fly)
}

export default function FlyingContainer(
    props: {
        children?: Children,
        start?: { x: number, y: number },
        flyTo?: { x: number, y: number },
    }
): JSX.Element {
    ({ stage, ticker } = usePixiApp())
    if (props.children) children = props.children
    if (props.start) {
        start = props.start;
        ({ x, y } = start)
    }

    useEffect(() => {
        if (!props.flyTo) return undefined

        return flyTo(props.flyTo)
    }, [props.flyTo])

    return <Container x={x} y={y}>
        {children}
    </Container>
}
