import { Application, PixiApplication, Container, Sprite } from './mypixi'
import { styled } from '../util'
import frogKnight from './assets/Frog_Knight_sprite.png'
import background from './background'
import styles from './styles.module.css'
export function Canvas(): HTMLCanvasElement {
    const c = styled('canvas', styles.gameCanvas)
    c.width = 1920
    c.height = 1080
    return c
}

export function start(canvas: HTMLCanvasElement): PixiApplication {
    const fk = Sprite({
        src: frogKnight,
        anchor: 0.5,
        position: [canvas.width / 2, canvas.height / 2],
        scale: 0.3
    })
    const c = Container({
        position: [canvas.width / 4, canvas.height / 4],
        children: [fk],
    })
    const bg = background({ scale: 1 })
    return Application({
        canvas,
        children: [
            bg, c
        ]
    })
}
