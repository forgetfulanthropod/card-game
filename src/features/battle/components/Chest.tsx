import { Container, PixiComponent, Sprite, useApp as usePixiApp } from '@inlet/react-pixi'
import { useTimeout } from 'ahooks'
// import type { Graphics as PixiGraphics } from 'pixi.js'
import { Loader, Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js'
import React, { useEffect, useState } from 'react'
import { useLoaderContext } from '../providers/LoaderContext'
import type { AssetKey } from './AssetLoader'


const dataOf = (assetId: AssetKey) => Loader.shared.resources?.[assetId]?.data

export default function Chest(props: { size: SizeQ }): JSX.Element {
    const { ticker, screen } = usePixiApp()
    const [lid, setLid] = useState<PixiSprite | null>(null)
    const [showItems, setShowItems] = useState(false)
    useTimeout(() => {
        setShowItems(true)
    }, 1000)
    // const [body, setBody] = useState<PixiSprite | null>(null)
    console.log('chest render')

    const { isBasicLoaded } = useLoaderContext()

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
    if (!isBasicLoaded) return <></>
    return <>
        {props.size.width != null && <Overlay size={props.size as Size} />}
        <Container scale={scale} position={{ x: screen.width * .65, y: screen.height * .4 }}>

            <Sprite
                anchor={{ x: 1, y: .3 }}
                // ref={setBody}
                image={dataOf('chestBody')} />
            {showItems && <>
                <Sprite image={dataOf('fishstick')} />
                <Sprite image={dataOf('potion')} />
            </>}
            <Sprite
                ref={s => setLid(s)}
                image={dataOf('chestLid')}
                pivot={{ x: -50, y: 0 }}
                anchor={{ x: .95, y: .4 }}
            />
            {/* <Graphics draw={g => {
                if (lid == null) return
                drawCircle(g, 'red', lid.pivot.x, lid.pivot.y, 40)
                drawCircle(g, 'green', lid.anchor.x, lid.anchor.y, 20)
                if (body == null) return
                drawCircle(g, 'orange', body.anchor.x, body.anchor.y, 10)
            }} /> */}
        </Container>
    </>
}


const Overlay = PixiComponent<{ size: Size }, PixiSprite>('Overlay', {
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
