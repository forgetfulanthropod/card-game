import type { DisplayObject } from 'pixi.js'

import type { InteractionEventHandler } from './_types'

export interface InteractionEvents {
    pointerdown?: InteractionEventHandler
    pointerup?: InteractionEventHandler
    pointerover?: InteractionEventHandler
    pointerout?: InteractionEventHandler
    pointermove?: InteractionEventHandler
}

export function bindEvents(
    events: InteractionEvents | undefined,
    el: DisplayObject
) {
    if (events == null || Object.keys(events).length === 0) return
    el.interactive = true
    el.cursor = 'pointer'
    Object.entries(events).forEach(([eventName, handler]) =>
        el.on(eventName, handler)
    )
}
