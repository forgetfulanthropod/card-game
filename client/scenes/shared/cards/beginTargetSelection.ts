import type { Card } from 'shared'

import { callApi } from '@/callApi'
import { localTree } from '@/data'
import {
    Container,
    DisplayObject,
    getRenderer,
    getStage,
    PixiContainer,
    portalize,
} from '@/elementsUtil'
import { selectedForTargetingCardUid, isTargeting, onUpdate } from '@/util'
import { TargetingArrow } from './TargetingArrow'

export function beginTargetSelection(
    root: PixiContainer,
    cardMeta: Card
): () => void {
    selectedForTargetingCardUid.set(cardMeta.uid)
    localTree.set('selectedTargets', [])

    const renderer = getRenderer()
    const defaultCursor = renderer.events.cursorStyles.default
    const hoverCursor = renderer.events.cursorStyles.hover
    const hiddenCursor = renderer.events.cursorStyles.hidden

    const cleanup = onCancelTargeting(() => {
        unsubFromSelectedTargets()
        unsubFromIsTargeting()
        isTargeting.set(false)
        selectedForTargetingCardUid.set(null)
        arrow?.destroy()

        renderer.events.setCursor('defaultFallback')
        renderer.events.cursorStyles.default = defaultCursor
        renderer.events.cursorStyles.hover = hoverCursor
    })

    const unsubFromIsTargeting = isTargeting.onChange(isTargeting => {
        if (isTargeting) {
            getRenderer().events.cursorStyles.default = hiddenCursor
            getRenderer().events.cursorStyles.hover = hiddenCursor

            arrow = root.addChild(
                portalize({
                    from: Container({}),
                    content: TargetingArrow(cardMeta, cleanup),
                })
            )
        }
    })

    let arrow: DisplayObject

    const unsubFromSelectedTargets = listenToSelectedTargets(cardMeta, cleanup)

    return cleanup
}

function listenToSelectedTargets(cardMeta: Card, cleanup: () => void) {
    return onUpdate(
        localTree.select('selectedTargets'),
        (targets: string[]) => {
            const numTargets = cardMeta.targetNum
            if (targets.length >= numTargets) {
                void callApi('playCard', {
                    cardUid: cardMeta.uid,
                    targetUids: targets,
                })
                cleanup()
            } else if (targets.length > numTargets) {
                void callApi('playCard', {
                    cardUid: cardMeta.uid,
                    targetUids: targets.slice(targets.length - numTargets),
                })
                cleanup()
            }
        }
    )
}

function onCancelTargeting(externalCleanup: () => void) {
    const cleanup = () => {
        getStage().off('pointerleave', cleanup)
        window.removeEventListener('contextmenu', rightClickListener)
        window.removeEventListener('keydown', keydownListener)

        externalCleanup()
    }

    // getStage().once('pointerleave', cleanup)

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

    return cleanup
}

// const app = getPixiApp()
// app.stage.interactive = true

// let origin: Point = { x: 0, y: 0 }
// let offset: Point = { x: 0, y: 0 }
// const arrow = TargetSelectGraphic()
// TODO: only update on card animating or pointer move
// currently updates on every frame
// const updateDestination = (e: FederatedPointerEvent) => {
//     const cardBounds = cardEl?.children?.[0]?.getBounds()
//     if (cardBounds == null) return
//     const x0 = (cardBounds.left + cardBounds.right) / 2
//     const y0 = cardBounds.top
//     offset = { x: x0, y: y0 }
//     const destination: Point = {
//         x: e.global.x - offset.x,
//         y: e.global.y - offset.y,
//     }
//     drawCurve(arrow, origin, destination)
// }
// const tickerArrow = (_: number) => {
//     updateDestination((app.renderer.events as any).rootPointerEvent)
// }
// app.stage.interactive = true
// app.ticker.add(tickerArrow)
// updateDestination((app.renderer.events as any).rootPointerEvent)

// app.stage.on('pointermove', updateDestination)
// app.stage.once('pointerleave', cleanup)

// const rightClickListener = (e: Event) => {
//     e.preventDefault()
//     cleanup()
// }
// window.addEventListener('contextmenu', rightClickListener)

// const keydownListener = (e: KeyboardEvent) => {
//     e.preventDefault()
//     if (e.key === 'Escape') cleanup()
// }
// window.addEventListener('keydown', keydownListener, false)
// cardEl.addChild(arrow)

// removeEventListener('contextmenu', rightClickListener)
// removeEventListener('keydown', keydownListener)

// selectedTargetsCursor.set([])
// // app.stage.off('pointermove', updateDestination)
// app.ticker.remove(tickerArrow)
// cardEl.removeChild(arrow)
// if (!arrow.destroyed) arrow.destroy({ children: true })
// app.stage.interactive = false
