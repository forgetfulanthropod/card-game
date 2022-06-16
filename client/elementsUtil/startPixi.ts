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

    bindGamestate(app)
}
