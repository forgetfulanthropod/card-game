import type { Card } from 'shared'

import { callApi } from '@/callApi'
import { localTree } from '@/data'
import { PixiContainer } from '@/elementsUtil'
import { getPixiApp } from '@/elementsUtil'
import { hoveredSelectedCardUid, isAttacking, onUpdate } from '@/util'
import { FederatedPointerEvent, Rectangle } from 'pixi.js'
import { TargetSelectGraphic, drawCurve } from './TargetSelectGraphic'

export function beginTargetSelection(
    cardEl: PixiContainer,
    cardMeta: Card
): () => void {
    const numTargets = cardMeta.targetNum
    hoveredSelectedCardUid.set(cardMeta.uid)
    isAttacking.set(true)

    const app = getPixiApp()
    app.stage.interactive = true

    let origin: Point = { x: 0, y: 0 }
    let offset: Point = { x: 0, y: 0 }
    const arrow = TargetSelectGraphic()
    // TODO: this should not fire when dead
    const updateDestination = (e: FederatedPointerEvent) => {
        const cardBounds = cardEl?.children?.[0]?.getBounds()
        if (cardBounds == null) return
        const x0 = (cardBounds.left + cardBounds.right) / 2
        const y0 = cardBounds.top
        offset = { x: x0, y: y0 }
        const destination: Point = {
            x: e.global.x - offset.x,
            y: e.global.y - offset.y,
        }
        drawCurve(arrow, origin, destination)
    }
    app.stage.interactive = true

    updateDestination((app.renderer.events as any).rootPointerEvent)

    app.stage.on('pointermove', updateDestination)
    app.stage.once('pointerleave', cleanup)

    const rightClickListener = (e: Event) => {
        e.preventDefault()
        cleanup()
    }
    window.addEventListener('contextmenu', rightClickListener)

    const keydownListener = (e: KeyboardEvent) => {
        e.preventDefault()
        if (e.key === 'Escape') cleanup()
    }
    window.addEventListener('keydown', keydownListener, false)
    cardEl.addChild(arrow)

    localTree.set('selectedTargets', [])
    const selectedTargetsCursor = localTree.select('selectedTargets')

    const unsub = onUpdate(selectedTargetsCursor, (targets: string[]) => {
        if (targets.length >= numTargets) {
            void callApi('playCard', {
                cardUid: cardEl.name,
                targetUids: targets,
            })
            cleanup()
        } else if (targets.length > numTargets) {
            void callApi('playCard', {
                cardUid: cardEl.name,
                targetUids: targets.slice(targets.length - numTargets),
            })
            cleanup()
        }
    })

    function cleanup() {
        unsub()
        isAttacking.set(false)
        hoveredSelectedCardUid.set(null)
        removeEventListener('contextmenu', rightClickListener)
        removeEventListener('keydown', keydownListener)

        selectedTargetsCursor.set([])
        app.stage.off('pointermove', updateDestination)
        cardEl.removeChild(arrow)
        if (!arrow.destroyed) arrow.destroy({ children: true })
        app.stage.interactive = false
    }

    return cleanup
}
