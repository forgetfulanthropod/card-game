
import type { PixiApplication, PixiContainer } from '@/elementsUtil'
import { Application } from '@/elementsUtil'

import { bindGamestate } from '../logic/bindGamestate'


const config = {
    showOneThing: null as (null | (() => PixiContainer)),
    // showOneThing: () => DoorsStories('log'),
}

export function start(canvas: HTMLCanvasElement): PixiApplication {
    // const scale = window.innerWidth / BASE_WIDTH

    if (config?.showOneThing != null) {
        return Application({ canvas, children: [config?.showOneThing()] })
    }
    const app = Application({ canvas, children: [] })

    bindGamestate(app)

    return app
}
