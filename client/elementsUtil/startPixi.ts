import type { PixiContainer } from '@/elementsUtil'
import { assetsLoadedPromise, Application } from '@/elementsUtil'
import { bindGamestate } from '@/scenes'

const config = {
    showOneThing: null as null | (() => PixiContainer),
    // showOneThing: () => DoorsStories('log'),
}

export async function startPixi(canvas: HTMLCanvasElement): Promise<void> {
    // const scale = window.innerWidth / BASE_WIDTH
    await assetsLoadedPromise()
    if (config?.showOneThing != null) {
        Application({ canvas, children: [config?.showOneThing()] })
        return
    }
    const app = Application({
        canvas,
        children: [],
    })
    // @ts-expect-error
    window.app = app
    app.ticker.maxFPS = 30
    app.ticker.minFPS = 10

    // app.stage.addChild(Graphics({ draw: g => {
    //     g.draw
    // }}))

    // addSpineCharacter(app)
    enableOnHover()
    bindGamestate(app)
}

/**
 * (WORKAROUND) This hack fixes the bug of pixi elements not having on-hover functionality on pixi load (even though they've been set to interactive and events binded properly) by adding a new element to the window, then removing it. The manual workaround before this was to hover over the reload button or anywhere outside of the pixi canvas. Root cause is still at large.
 */
const enableOnHover = () => {
    const fullScreenCover = document.createElement('div')
    window.document.body.appendChild(fullScreenCover)
    fullScreenCover.style.height = '100vh'
    fullScreenCover.style.width = '100vw'
    fullScreenCover.style.position = 'absolute'
    setTimeout(() => {
        fullScreenCover.remove()
    }, 10)
}
