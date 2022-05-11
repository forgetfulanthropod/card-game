import type { Card, CharacterUid } from '@shared'
import type { Datum } from 'datums'
import { datum } from 'datums'
import { InteractionEvent, InteractionManager } from 'pixi.js'

import type { PixiContainer } from '@/elementsUtil'
import { PixiGraphics } from '@/elementsUtil'
import { Container, getPixiApp } from '@/elementsUtil'
import { getBattleScene } from '@/data/rootTree'
import { onUpdate } from '@/util/onUpdate'
import { doCharacterAction, playCard } from '@/actions'
import { localTree } from '@/data/localTree'

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

    const handlePointerMove = (e: InteractionEvent) => {
        destination.set({ x: e.data.global.x, y: e.data.global.y })
    }
    app.stage.interactive = true
    // app.stage.interactiveChildren = true

    // app.stage.interactive = true
    // const interaction = app.renderer.plugins.interaction
    app.stage.on('pointermove', handlePointerMove)

    const arrow = Arrow(origin, destination)
    app.stage.addChild(arrow)

    const scene = getBattleScene()

    const selectedTargetsCursor = localTree.select('selectedTargets')
    const unsub = onUpdate(selectedTargetsCursor, targets => {
        if (targets.length >= numTargets) {
            doCharacterAction({ uid: targets[0] })
            playCard({
                cardUid: cardEl.name, //cardMeta.id
                targetUids: [targets[0]],
            })
            cleanup()
        }
    })
    function cleanup() {
        unsub()
        selectedTargetsCursor.set([])
        app.stage.off('pointermove', handlePointerMove)
        app.stage.removeChild(arrow)
        arrow.destroy({ children: true })
        app.stage.interactive = false
        // app.stage.interactiveChildren = false
    }
    // return new Promise(resolve => {
    //     app.stage.on('stageout', () => {
    //         alert("shit they're gone!")
    //         resolve([])
    //     })
    // })

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
