import { datum } from 'datums'
import type { InteractionEvent } from 'pixi.js'
import type { Card } from 'shared'

import { debounce } from 'lodash'
import { TargetSelectGraphic } from './TargetSelectGraphic'
import { callApi } from '@/callApi'
import { localTree } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import { getPixiApp } from '@/elementsUtil'
import { hoveredSelectedCardUid, isAttacking, onUpdate } from '@/util'

export function beginTargetSelection(
    cardEl: PixiContainer,
    cardMeta: Card
): () => void {
    const numTargets = cardMeta.targetNum
    hoveredSelectedCardUid.set(cardMeta.uid)
    isAttacking.set(true)

    const app = getPixiApp()

    const origin = datum({ x: 0, y: 0 })

    const destination = datum({ x: origin.val.x, y: origin.val.y })

    // TODO: this should not fire when dead
    const updateDestination = (e: InteractionEvent) => {
        const cardBounds = cardEl?.children?.[0]?.getBounds()
        if (cardBounds == null) return
        const x0 = (cardBounds.left + cardBounds.right) / 2
        const y0 = cardBounds.top

        destination.set({
            x: e.data.global.x - x0,
            y: e.data.global.y - y0,
        })
    }
    app.stage.interactive = true
    app.stage.on('pointermove', updateDestination)
    app.stage.once('pointerout', cleanup)

    const rightClickListener = (e: Event) => {
        e.preventDefault()
        cleanup()
    }
    window.addEventListener('contextmenu', rightClickListener)

    const keydownListener = (e: KeyboardEvent) => {
        e.preventDefault()
        cleanup()
        if (e.key === 'Escape') cleanup()
    }
    window.addEventListener('keydown', keydownListener, false)

    const arrow = TargetSelectGraphic(origin, destination)
    cardEl.addChild(arrow)

    localTree.set('selectedTargets', [])
    const selectedTargetsCursor = localTree.select('selectedTargets')

    const unsub = onUpdate(
        selectedTargetsCursor,
        debounce((targets: string[]) => {
            if (targets.length === numTargets) {
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
            } else {
                console.log('TODO: check targeting unsub')
            }
        }, 10)
    )

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
