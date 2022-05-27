import type { RODatum } from 'datums'
import { onDestroyed, PixiGraphics } from '@/elementsUtil'

export function Arrow(origin: RODatum<Point>, destination: RODatum<Point>) {
    const pointRadius = 10
    const g = new PixiGraphics()
    g.name = Arrow.name
    return onDestroyed(
        g,
        destination.onChange(draw, true),
        origin.onChange(draw, true)
    )

    function draw() {
        g.clear()
        const { x: x0, y: y0 } = origin.val
        const { x: x1, y: y1 } = destination.val
        const [xc, yc] = [x0, y1 - Math.abs(y0 - y1) * 0.33] // curve up 33% past targetfirst
        g.lineStyle(5, 0xaa0000, 1)
        g.moveTo(x0, y0)
        g.bezierCurveTo(x0, y0, xc, yc, x1, y1)
        g.beginFill(0xffffff)
        g.drawCircle(origin.val.x, origin.val.y, pointRadius)
        g.drawCircle(destination.val.x, destination.val.y, pointRadius)
        g.endFill()
    }
}
