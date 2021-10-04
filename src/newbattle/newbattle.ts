import { Application, MyApplication } from './mypixi'
import { styled } from '../util'
import frogKnight from './assets/Frog_Knight_sprite.png'
import background from './background'
import { MySprite } from './mypixi'
import styles from './styles.module.css'
export function Canvas(): HTMLCanvasElement {
    const c = styled('canvas', styles.gameCanvas)
    c.width = 1920
    c.height = 1080
    return c
}

export function start(canvas: HTMLCanvasElement): Application {
    const fk = MySprite({
        src: frogKnight,
        anchor: 0.5,
        position: [canvas.width / 2, canvas.height / 2],
        scale: 0.3
    })
    const bg = background({ scale: 1 })
    return MyApplication({
        canvas,
        children: [
            bg, fk
        ]
    })
}
