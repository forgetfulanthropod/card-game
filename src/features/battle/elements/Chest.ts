import EventEmitter from 'eventemitter3'
import type { AssetKey } from '../logic/AssetLoader'
import { Container, PixiContainer, PixiLoader, PixiSprite, PixiTexture, Sprite } from './mypixi'

const dataOf = (assetId: AssetKey) => PixiLoader.shared.resources?.[assetId]?.texture as PixiTexture

const rotationRate = 1.0
const baseSize = 500


export default function Chest(args: { size: Size }): PixiContainer {
    const c = Container({
        scale: 1,
        children: [
            Overlay({ size: args.size }),
            Sprite({
                name: 'Chest',
                anchor: [1, .3],
                src: dataOf('chestBody'),
                onTick: (lid, elapsed) => {
                    lid.angle = Math.min(lid.angle + rotationRate * elapsed, 45)
                }
            })
        ]
    })

    setTimeout(() => {
        c.addChild(Sprite({ name: 'fishstick', src: dataOf('fishstick') }))
        c.addChild(Sprite({ name: 'potion', src: dataOf('potion') }))
    }, 1000)

    return c

    // <Graphics draw={g => {
    //     if (lid == null) return
    //     drawCircle(g, 'red', lid.pivot.x, lid.pivot.y, 40)
    //     drawCircle(g, 'green', lid.anchor.x, lid.anchor.y, 20)
    //     if (body == null) return
    //     drawCircle(g, 'orange', body.anchor.x, body.anchor.y, 10)
    // }}/>
}


function Overlay(args: { size: Size }): PixiSprite {
    return Sprite({
        name: 'Overlay',
        src: PixiTexture.WHITE,
        width: args.size.width,
        height: args.size.height,
        tint: 0x000000,
        alpha: 0.5,
    })
}
