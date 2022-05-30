import type { RODatum } from 'datums'
import { onDestroyed, PixiGraphics, ROOT_SCALE } from '@/elementsUtil'

export function TargetSelectGraphic(
    origin: RODatum<Point>,
    destination: RODatum<Point>
) {
    const pointRadius = 10
    const g = new PixiGraphics()

    return onDestroyed(
        g,
        destination.onChange(draw, true),
        origin.onChange(draw, true)
    )

    function draw() {
        g.clear()
        const { x: x0, y: y0 } = origin.val
        const { x: x1, y: y1 } = {
            x: destination.val.x / ROOT_SCALE,
            y: destination.val.y / ROOT_SCALE,
        }
        const [xc, yc] = [x0, y1 - Math.abs(y0 - y1) * 0.33] // curve up 33% past targetfirst
        g.lineStyle(5, 0xaa0000, 1)
        g.moveTo(x0, y0)
        g.bezierCurveTo(x0, y0, xc, yc, x1, y1)
        g.beginFill(0xffffff)
        g.drawCircle(x0, y0, pointRadius)
        g.drawCircle(x1, y1, pointRadius)
        g.endFill()
    }
}
