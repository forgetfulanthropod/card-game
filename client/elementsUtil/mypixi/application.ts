import { Tweener } from 'pixi-tweener'
import { Renderer } from 'pixi.js'
import { isMobile } from 'mobile-device-detect'
import { registerPixiInspector } from './pixiInspector'
import type { PixiContainer, PixiSprite } from './aliases'
import { PixiApplication } from './aliases'

export const ROOT_SCALE = isMobile ? 1 : 2

const application = null
let app: null | PixiApplication = null
export function Application(args: {
    canvas: HTMLCanvasElement
    children: (PixiSprite | PixiContainer)[]
}): PixiApplication {
    const resW = 1920 * ROOT_SCALE
    const resH = 1080 * ROOT_SCALE

    app = new PixiApplication({
        view: args.canvas,
        // resolution: window.devicePixelRatio || 1,
        // backgroundColor: 0x6495ed,
        width: resW,
        height: resH,
        antialias: true,
        powerPreference: 'high-performance',
    })

    app.stage.scale.set(ROOT_SCALE)
    app.ticker.maxFPS = 30

    // const delay = 10_000
    // let frames = 0
    // app.ticker.add(() => frames++)
    // setTimeout(() => console.log('TRUE FPS:', frames / (delay / 1000)), delay)
    Tweener.init(app.ticker)

    setTimeout(function CornerEl() {
        const div = document.createElement('div')
        div.style.fontSize = '14px'
        div.style.fontFamily = 'monospace'
        div.style.color = 'white'
        div.style.position = 'absolute'
        div.style.top = '0px'

        // eslint-disable-next-line
        app!.ticker.add(_ => {
            div.innerText = `${Math.round(
                // eslint-disable-next-line
                app!.ticker.FPS
            )} frames per second`
        })
        document.body.appendChild(div)
    }, 10)

    for (const c of args.children) {
        app.stage.addChild(c)
    }
    // @ts-expect-error
    window.app = app
    registerPixiInspector()
    return app
}

export function getPixiApp(): PixiApplication {
    if (app == null) throw Error('pixi application is null')
    return app
}

export function getRenderer(): Renderer {
    if (
        !(app instanceof PixiApplication) ||
        !(app.renderer instanceof Renderer)
    )
        throw new Error("The pixi app isn't ready yet sir")

    return app.renderer
    // return (getPixiApp() as PixiApplication).renderer as Renderer
}
