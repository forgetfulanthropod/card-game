import type { PixiContainer } from '@/elementsUtil'
import { Container, PixiTexture, Sprite } from '@/elementsUtil'

export function Gather(): PixiContainer {
    const square = Sprite({
        src: PixiTexture.WHITE,
        // onClick: () => alert('clicked'),
        width: 300,
        height: 500,
        x: 700,
        y: 200,
    })
    square.interactive = true
    square.on('pointerdown', function (e) {
        console.log('Picked up')

        square.offX = e.data.global.x - square.x
        square.offY = e.data.global.y - square.y
        square.dragging = true
    })
    square.on('pointermove', function (e) {
        // console.log('Dragging')

        if (square.dragging) {
            square.x = e.data.global.x - square.offX
            square.y = e.data.global.y - square.offY
        }
    })
    square.on('pointerup', function (e) {
        square.dragging = false
    })
    return Container({
        children: [square],
    })
}
