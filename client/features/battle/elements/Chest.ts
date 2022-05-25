import type { PixiContainer, PixiSprite } from '@/elementsUtil'
import { Container, getTexture, PixiTexture, Sprite } from '@/elementsUtil'

const rotationRate = 1.0

export function Chest(args: { size: Size }): PixiContainer {
    const c = Container({
        scale: 1,
        // anchor: 0.5,
        x: args.size.width / 2,
        y: args.size.height / 2,
        children: [
            Overlay({ size: args.size }),
            Sprite({
                name: 'Chest',
                x: 300,
                anchor: [1, 0.3],
                src: getTexture('chestBody'),
            }),
            Sprite({
                name: 'Chest',
                // anchor: [1, .3],
                x: 300,
                pivot: [-50, 0],
                anchor: [0.95, 0.4],
                src: getTexture('chestLid'),
                onTick: (lid, elapsed) => {
                    lid.angle = Math.min(lid.angle + rotationRate * elapsed, 45)
                },
            }),
        ],
    })

    setTimeout(() => {
        c.addChild(
            Sprite({
                name: 'fishstick',
                src: getTexture('fishstick'),
                x: -220,
                y: -120,
            })
        )
        c.addChild(
            Sprite({
                name: 'potion',
                src: getTexture('potion'),
                x: -100,
                y: -120,
            })
        )
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
        anchor: 0.5,
        width: args.size.width,
        height: args.size.height,
        tint: 0x000000,
        alpha: 0.5,
    })
}
