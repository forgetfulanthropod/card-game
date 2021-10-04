import { Application, Sprite } from 'pixi.js'
import { styled } from '../util'
import frogKnight from './assets/Frog_Knight_sprite.png'
import { MySprite } from './mypixi'
import styles from './styles.module.css'
export function Canvas(): HTMLCanvasElement {
    return styled('canvas', styles.gameCanvas)
}

export function start(canvas: HTMLCanvasElement): Application {
    const app = new Application({
        view: canvas,
        resolution: window.devicePixelRatio || 1,
        backgroundColor: 0x6495ed,
        width: 640,
        height: 480
    })

    const fk: Sprite = MySprite({
        src: frogKnight,
        anchor: 0.5,
        position: [app.screen.width / 2, app.screen.height / 2],
        scale: 0.3
    })
    app.stage.addChild(fk)
    return app
}
