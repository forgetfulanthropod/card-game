import { range } from 'lodash'
import { Viewport } from 'pixi-viewport'

import { Application, Sprite } from '@/elementsUtil'

import mapPng from '../assets/map.png'
import arrowPng from '../assets/worn-arrow.png'

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
    const arrows = range(4).map(i => {
        console.log('adding sprite at angle', 90 * i)
        return Sprite({
            src: arrowPng,
            angle: 90 * i,
        })
    })
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
