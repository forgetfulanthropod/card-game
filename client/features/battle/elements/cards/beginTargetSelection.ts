import type { Datum } from 'datums'
import { datum } from 'datums'
import type { InteractionEvent } from 'pixi.js'
import type { Card } from 'shared'

import { callApi } from '@/actions'
import { localTree } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import { PixiGraphics, Container, getPixiApp } from '@/elementsUtil'
import { onUpdate } from '@/util'

export function beginTargetSelection(
    cardEl: PixiContainer,
    cardMeta: Card
): void {
    const numTargets = cardMeta.targetNum
    console.log('beginning target selection')

    const app = getPixiApp()

    const cardBounds = cardEl.getBounds()
    const x0 = (cardBounds.left + cardBounds.right) / 2
    const y0 = cardBounds.top
    const origin = datum({ x: x0, y: y0 })

    const destination = datum({ x: x0, y: y0 })

    const updateDestination = (e: InteractionEvent) => {
        destination.set({ x: e.data.global.x, y: e.data.global.y })
    }
    app.stage.interactive = true
    app.stage.on('pointermove', updateDestination)
    app.stage.on('pointerout', () => cleanup())

    window.addEventListener(
        'keydown',
        e => {
            if (e.key === 'Escape') cleanup()
        },
        false
    )

    const arrow = Arrow(origin, destination)
    app.stage.addChild(arrow)

    const selectedTargetsCursor = localTree.select('selectedTargets')

    const unsub = onUpdate(selectedTargetsCursor, async (targets: string[]) => {
        if (targets.length >= numTargets) {
            console.log('selected targets cursor')
            console.log(cardMeta)

            await callApi('PlayCard', {
                cardUid: cardEl.name, //cardMeta.id,
                targetUids: [targets[0]],
            })
            cleanup()
        }
    })

    function cleanup() {
        unsub()
        selectedTargetsCursor.set([])
        app.stage.off('pointermove', updateDestination)
        app.stage.removeChild(arrow)
        arrow.destroy({ children: true })
        app.stage.interactive = false
    }
}

function Arrow(origin: Datum<Point>, destination: Datum<Point>) {
    const pointRadius = 10
    const g = new PixiGraphics()

    return Container({
        name: 'Arrow',
        children: [g],
        onDestroy: [destination.onChange(draw, true)],
    })

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

// ==========================

// function Parent() {
//     const pos = datum({ x: 0, y: 0 })
//     function handleClick(newPos) {
//         pos.set(newPos)
//     }
//     return Arrow2(pos)
// }
// type Point = { x: number; y: number }
// function Arrow2(pos: Datum<Point>) {
//     pos.onChange(({ x, y }) => {
//         tip.x = x
//         tip.y = y
//     }, true)
//     return arrow
// }

// function Character1(glow: Datum<boolean>) {}
// interface Targets {
//     cards: Id[]
//     characters: Id[]
//     orbs: Id[] //attack orbs
//     // allies: Id[] //allies aggressive
// }
// // function Character2(targets: Datum<Targets>) {

// function Character2() {
//     targetsCursor.onChange(() => {
//         if (iAmValidTarget(characterMeta.uid)) doThing()
//     })
// }

// on('attack', (gotHit: ID[]) => {
//     if (gotHit.includes(myId)) {
//     }
// })

// function amITarget() {}
