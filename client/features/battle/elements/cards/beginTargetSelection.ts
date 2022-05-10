import type { Card, CharacterUid } from '@shared'
import type { Datum } from 'datums'
import { datum } from 'datums'
import type { InteractionEvent } from 'pixi.js'

import type { PixiContainer } from '@/elementsUtil'
import { PixiGraphics } from '@/elementsUtil'
import { Container, getPixiApp } from '@/elementsUtil'

export async function beginTargetSelection(
    cardEl: PixiContainer,
    cardMeta: Card
): Promise<CharacterUid[]> {
    console.log('beginning target selection')

    const app = getPixiApp()

    const cardBounds = cardEl.getBounds()
    const x0 = (cardBounds.left + cardBounds.right) / 2
    const y0 = cardBounds.top
    const origin = datum({ x: x0, y: y0 })

    const destination = datum({ x: x0, y: y0 })

    const interaction = app.renderer.plugins.interaction
    interaction.on('stagemove', (e: InteractionEvent) => {
        console.log('stagemove')
        destination.set({ x: e.data.global.x, y: e.data.global.y })
    })

    setTimeout(() => app.stage.addChild(Arrow(origin, destination)), 0)

    return new Promise(resolve => {
        interaction.on('stageout', () => {
            alert("shit they're gone!")
            resolve([])
        })
    })

    // listeningForeground

    // interaction.on('stageup', this.onMouseUp);
    // interaction.on('stagein', this.onMouseIn);
    // interaction.on('stageout', this.onMouseOut);

    // cardEl.parent.addChild()

    // listeningForeground.on('pointermove')

    // const x1 = 1
    // const y1 = 1
}

function Arrow(origin: Datum<Point>, destination: Datum<Point>) {
    const pointRadius = 20

    const g = new PixiGraphics()

    return Container({
        name: 'Arrow',
        children: [g],
        onDestroy: [destination.onChange(draw, true)],
    })

    function draw() {
        g.clear()

        console.log({ originVal: origin.val, destinationVal: destination.val })

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
