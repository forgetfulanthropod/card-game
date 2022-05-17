import { createEventBus, slot } from 'ts-event-bus'

import type { SceneType } from '@/../shared'

export const localBus = createEventBus({
    events: {
        sceneChange: slot<SceneType>(),
        bgLoopEnded: slot<void>(),
    },
})
