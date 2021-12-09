import { clamp, sample } from 'lodash'

import type { PixiContainer, PixiSprite } from '@/elementsUtil'
import { Container, PixiTexture, Sprite } from '@/elementsUtil'

export function Gather(): PixiContainer {
    const makeSquare = () =>
        makeDraggable(
            Sprite({
                src: sample([PixiTexture.WHITE]),
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

function makeDraggable(sprite: PixiSprite, margin = 10): PixiSprite {
    let offX = 0
    let offY = 0
    let dragging = false
    // const { width, height } = getAppSize()
    // console.log({ width, height })
    const [width, height] = [1920, 1080]

    sprite.interactive = true
    sprite.on('pointerdown', e => {
        offX = e.data.global.x - sprite.x
        offY = e.data.global.y - sprite.y
        dragging = true
    })
    sprite.on('pointermove', e => {
        if (dragging) {
            sprite.x = clamp(e.data.global.x - offX, margin - sprite.width, width - margin)
            sprite.y = clamp(e.data.global.y - offY, margin - sprite.height, height - margin)
        }
    })
    sprite.on('pointerup', () => {
        dragging = false
    })
    return sprite
}
