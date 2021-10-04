import { Application, Sprite } from 'pixi.js'
import { styled } from '../util'
import frogKnight from './assets/Frog_Knight_sprite.png'
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

    const fk: Sprite = Sprite.from(frogKnight)

    fk.anchor.set(0.5)
    fk.x = app.screen.width / 2
    fk.y = app.screen.height / 2
    fk.scale.x = 0.3
    fk.scale.y = 0.3

    app.stage.addChild(fk)
    return app
}
