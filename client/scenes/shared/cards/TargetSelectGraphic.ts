import { ROOT_SCALE } from '@/elementsUtil'
import { Graphics, Rectangle } from 'pixi.js'

const pointRadius = 10

export const drawCurve = (g: Graphics, origin: Point, destination: Point) => {
    const { x: x0, y: y0 } = origin
    const { x: x1, y: y1 } = {
        x: destination.x / ROOT_SCALE,
        y: destination.y / ROOT_SCALE,
    }
    const [xc, yc] = [x0, y1 - Math.abs(y0 - y1) * 0.33] // curve up 33% past targetfirst
    g.clear()
    g.lineStyle(5, 0xaa0000, 1)
    g.moveTo(x0, y0)
    g.bezierCurveTo(x0, y0, xc, yc, x1, y1)
    g.beginFill(0xffffff)
    g.drawCircle(x0, y0, pointRadius)
    g.drawCircle(x1, y1, pointRadius)
    g.endFill()
}

export function TargetSelectGraphic() {
    const g = new Graphics()
    g.interactive = false
    g.hitArea = new Rectangle(0, 0, 0, 0)
    return g
}
