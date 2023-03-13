import type { DisplayObject, DisplayObjectEvents } from 'pixi.js'
import type { Spine } from '@pixi-spine/all-4.1'

import type { InteractionEventHandler } from './_types'

export interface InteractionEvents {
    pointerdown?: InteractionEventHandler
    pointerup?: InteractionEventHandler
    pointerover?: InteractionEventHandler
    pointerout?: InteractionEventHandler
    pointermove?: InteractionEventHandler
    pointerleave?: InteractionEventHandler
    pointerenter?: InteractionEventHandler
}

export function bindEvents(
    events: InteractionEvents | undefined,
    el: DisplayObject | Spine
) {
    if (events == null || Object.keys(events).length === 0) return
    el.interactive = true
    el.cursor = 'hover'
    Object.entries(events).forEach(([eventName, handler]) =>
        el.on(eventName as keyof DisplayObjectEvents, handler)
    )
}
