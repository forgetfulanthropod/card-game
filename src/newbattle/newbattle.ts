import { Application } from './mypixi'
import { styled } from '../util'
import frogKnight from './assets/Frog_Knight_sprite.png'
import background from './background'
import { MySprite } from './mypixi'
import styles from './styles.module.css'
export function Canvas(): HTMLCanvasElement {
    return styled('canvas', styles.gameCanvas)
}

export function start(canvas: HTMLCanvasElement): Application {
    const app = new Application({
        view: canvas,
        resolution: window.devicePixelRatio || 1,
        // backgroundColor: 0x6495ed,
        width: 1920,
        height: 1080,
    })

    const fk = MySprite({
        src: frogKnight,
        anchor: 0.5,
        position: [app.screen.width / 2, app.screen.height / 2],
        scale: 0.3
    })
    const bg = background({ scale: 1 })
    app.stage.addChild(bg)
    app.stage.addChild(fk)
    return app
}
