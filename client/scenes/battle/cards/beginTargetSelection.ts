import { datum } from 'datums'
import type { InteractionEvent } from 'pixi.js'
import type { Card } from 'shared'

import { callApi } from '@/actions'
import { localTree } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import { getPixiApp, TargetSelectGraphic } from '@/elementsUtil'
import { onUpdate } from '@/util'

export function beginTargetSelection(
    cardEl: PixiContainer,
    cardMeta: Card
): () => void {
    const numTargets = cardMeta.targetNum
    console.log('beginning target selection')

    const app = getPixiApp()

    const origin = datum({ x: 0, y: 0 })

    const destination = datum({ x: origin.val.x, y: origin.val.y })

    const updateDestination = (e: InteractionEvent) => {
        const cardBounds = cardEl.children[0].getBounds()
        const x0 = (cardBounds.left + cardBounds.right) / 2
        const y0 = cardBounds.top

        destination.set({
            x: e.data.global.x - x0,
            y: e.data.global.y - y0,
        })
    }
    app.stage.interactive = true
    app.stage.on('pointermove', updateDestination)
    app.stage.on('pointerout', () => cleanup())

    cardEl.on('event', () => {
        console.log('el moved')
    })

    window.addEventListener(
        'keydown',
        e => {
            if (e.key === 'Escape') cleanup()
        },
        false
    )

    const arrow = TargetSelectGraphic(origin, destination)
    cardEl.addChild(arrow)
    console.log('arrow index: ' + cardEl.getChildIndex(arrow))

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
        cardEl.removeChild(arrow)
        if (!arrow.destroyed) arrow.destroy({ children: true })
        app.stage.interactive = false
    }

    return cleanup
}
