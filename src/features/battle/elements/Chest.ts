import type { AssetKey } from '../components/AssetLoader'
import { Container, PixiContainer, PixiLoader, PixiSprite, PixiTexture, Sprite } from './mypixi'
import EventEmitter from 'eventemitter3'

const dataOf = (assetId: AssetKey) => PixiLoader.shared.resources?.[assetId]?.texture as PixiTexture

const rotationRate = 1.0
const baseSize = 500


export default function Chest(args: { size: Size }): PixiContainer {
    const EE = new EventEmitter<'showItems'>()

    const c = Container({
        scale: baseSize / args.size.width,
        children: [
            Overlay({ size: args.size }),
            Sprite({
                anchor: [1, .3],
                src: dataOf('chestBody'),
                onTick: (lid, elapsed) => {
                    lid.angle = Math.min(lid.angle + rotationRate * elapsed, 45)
                }
            })
        ]
    })

    setTimeout(() => EE.emit('showItems'), 1000)
    EE.on('showItems', () => {
        c.addChild(Sprite({ src: dataOf('fishstick') }))
        c.addChild(Sprite({ src: dataOf('potion') }))

    })
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
        src: PixiTexture.WHITE,
        width: args.size.width,
        height: args.size.height,
        tint: 0x000000,
        alpha: 0.5,
    })
}
