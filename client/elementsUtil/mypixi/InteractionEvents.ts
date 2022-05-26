import type { DisplayObject } from 'pixi.js'

import { keys } from 'shared/code'
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

    // console.log('binding', events)

    el.interactive = true
    //@ts-expect-error
    keys(events).map(eventId => {
        //@ts-expect-error
        el.on(eventId, events[eventId])
    })
}
