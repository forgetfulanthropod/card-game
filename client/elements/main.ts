import type { PixiApplication, PixiContainer } from '@/elementsUtil'
import { Application } from '@/elementsUtil'

import { addSpineCharacter } from './SpineCharacter'

const config = {
    showOneThing: null as null | (() => PixiContainer),
    // showOneThing: () => DoorsStories('log'),
}

export function start(canvas: HTMLCanvasElement): PixiApplication {
    // const scale = window.innerWidth / BASE_WIDTH

    if (config?.showOneThing != null) {
        return Application({ canvas, children: [config?.showOneThing()] })
    }
    const app = Application({
        canvas,
        children: [],
    })

    addSpineCharacter(app)

    // bindGamestate(app)

    return app
}
