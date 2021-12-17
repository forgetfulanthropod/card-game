import { range } from 'lodash'
import { Viewport } from 'pixi-viewport'

import { Application, Sprite } from '@/elementsUtil'

import mapPng from '../assets/map.png'
import arrowPng from '../assets/worn-arrow.png'

// const black = 0x000000
// const red = 0xff0000
// const green = 0x00ff00
// const blue = 0x0000ff

export function attachViewport(props: { canvas: HTMLCanvasElement }): void {
    console.log('attempting to attach viewport')
    const app = Application({ canvas: props.canvas, children: [] })

    // create viewport
    const viewport = new Viewport({
        // screenWidth: window.innerWidth / 2,
        // screenHeight: window.innerHeight / 2,
        // worldWidth: 1000,
        // worldHeight: 1000,

        interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    })

    // add the viewport to the stage
    app.stage.addChild(viewport)
    // png points down
    // order is bottom, left, top, right
    const offset = 100
    const spacing = 40
    const moveDist = 20
    const keys = ['bottom', 'left', 'top', 'right'] as const
    const arrows = range(4).map(i => {
        console.log('adding sprite at angle', 90 * i)
        return Sprite({
            src: arrowPng,
            angle: i * 90,
            // tint: [red, green, green, blue][i],
            scale: 0.1,
            x: offset + [0, -spacing, 0, spacing][i],
            y: offset + [spacing, 0, -spacing, 0][i],
            anchor: 0.5,
            onClick: () => {
                const key = keys[i]
                viewport[key] = viewport[key] + moveDist * [-1, 1, 1, -1][i]
            },
        })
    })
    arrows[0].tint = 0xff0000

    for (const a of arrows) {
        app.stage.addChild(a)
    }

    // activate plugins
    viewport.drag().pinch().wheel().decelerate()

    // add a red box
    // const sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    // sprite.tint = 0xff0000
    // sprite.width = sprite.height = 100
    // sprite.position.set(100, 100)

    // add the map
    viewport.addChild(Sprite({ src: mapPng }))
}
