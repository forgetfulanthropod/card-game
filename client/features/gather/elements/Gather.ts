import type { PixiContainer, PixiSprite } from '@/elementsUtil'
import { Container, PixiTexture, Sprite } from '@/elementsUtil'

export function Gather(): PixiContainer {
    const makeSquare = () =>
        makeDraggable(
            Sprite({
                src: PixiTexture.WHITE,
                // onClick: () => alert('clicked'),
                width: 300,
                height: 500,
                x: 600,
                y: 200,
            })
        )
    return Container({
        children: [makeSquare(), makeSquare()],
    })
}

function makeDraggable(sprite: PixiSprite): PixiSprite {
    let offX = 0
    let offY = 0
    let dragging = false

    sprite.interactive = true
    sprite.on('pointerdown', e => {
        offX = e.data.global.x - sprite.x
        offY = e.data.global.y - sprite.y
        dragging = true
    })
    sprite.on('pointermove', e => {
        if (dragging) {
            sprite.x = e.data.global.x - offX
            sprite.y = e.data.global.y - offY
        }
    })
    sprite.on('pointerup', () => {
        dragging = false
    })
    return sprite
}
