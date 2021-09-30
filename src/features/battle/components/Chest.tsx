import { Container, PixiComponent, Sprite, useApp as usePixiApp } from '@inlet/react-pixi'
// import type { Graphics as PixiGraphics } from 'pixi.js'
import { Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js'
import React, { useEffect, useState } from 'react'
import chestBodyPng from '../assets/CHEST_BODY.png'
import chestLidPng from '../assets/CHEST_LID.png'



export default function Chest(props: { size: SizeQ }): JSX.Element {
    const { ticker, screen } = usePixiApp()
    const [lid, setLid] = useState<PixiSprite | null>(null)
    const [body, setBody] = useState<PixiSprite | null>(null)
    console.log('chest render')


    useEffect((): void | Callback => {
        if (lid == null) return undefined
        if (ticker == null) return undefined
        const rotationRate = 1.0
        const tick = (elapsed: number) => {
            lid.angle = Math.min(lid.angle + rotationRate * elapsed, 45)
        }
        ticker.add(tick)
        return () => ticker.remove(tick)
    }, [lid, ticker])

    const baseSize = 500
    const scale = props.size.width == null ? 1 : baseSize / props.size.width
    return <>
        {props.size.width != null && <NewOverlay size={props.size as Size} />}
        <Container scale={scale} position={{ x: screen.width / 2, y: screen.height / 2 }}>

            <Sprite
                // anchor={0.5}
                anchor={{ x: 1, y: .3 }}
                ref={setBody}
                image={chestBodyPng} />
            <Sprite
                ref={s => setLid(s)}
                image={chestLidPng}
                // pivot={{ x: 100, y: 1 }}
                pivot={{ x: -50, y: 0 }}
                // anchor={{ x: 0, y: 0 }}
                anchor={{ x: .95, y: .4 }}
            // position={1}
            />
            {/* <Graphics draw={g => {
            if (lid == null) return
            drawCircle(g, 'red', lid.pivot.x, lid.pivot.y, 40)
            drawCircle(g, 'green', lid.anchor.x, lid.anchor.y, 20)
            if (body == null) return
            drawCircle(g, 'orange', body.anchor.x, body.anchor.y, 10)
        }}
        /> */}
        </Container>
    </>
}


const NewOverlay = PixiComponent<{ size: Size }, PixiSprite>('NewOverlay', {
    create: (props) => {
        console.log('new overlay createad')
        const bg = new PixiSprite(PixiTexture.WHITE)
        bg.width = props.size.width
        bg.height = props.size.height
        bg.tint = 0x000000
        bg.alpha = 0.5
        return bg
    },
})
