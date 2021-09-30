import { Container, Graphics, Sprite, useApp } from '@inlet/react-pixi'
import { Sprite as PXSprite } from 'pixi.js'
import React, { useEffect, useState } from 'react'
import chestBodyPng from '../assets/CHEST_BODY.png'
import chestLidPng from '../assets/CHEST_LID.png'



export default function Chest(): JSX.Element {
    const { ticker, screen } = useApp()
    const [lid, setLid] = useState<PXSprite | null>(null)

    useEffect((): void | Callback => {
        if (lid == null) return undefined
        const rotationRate = 1.0
        const tick = (elapsed: number) => {
            lid.angle = Math.min(lid.angle + rotationRate * elapsed, 90)
        }
        ticker.add(tick)
        return () => ticker.remove(tick)
    }, [lid, ticker])

    if (lid != null) {
        //pass
    }

    return <Container scale={{ x: .3, y: .3 }} position={{ x: screen.width / 2, y: screen.height / 2 }}>
        <Sprite
            // anchor={0.5}
            image={chestBodyPng} />
        <Sprite
            ref={s => setLid(s)}
            image={chestLidPng}
            // pivot={{ x: 100, y: 1 }}
            pivot={1}
            // anchor={{ x: 0, y: 0 }}
            anchor={1}
            position={1}
        />
        <Graphics draw={g => {
            if (lid == null) return
            g.beginFill(0xFF0000)
            g.drawCircle(lid.pivot.x, lid.pivot.y, 20)
            g.endFill()
            g.beginFill(0x00FF00)
            g.drawCircle(lid.anchor.x, lid.anchor.y, 10)
            g.endFill()

        }}
        />
    </Container>
}
