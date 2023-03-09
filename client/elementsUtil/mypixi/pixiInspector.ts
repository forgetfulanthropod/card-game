/* eslint-disable @typescript-eslint/no-unused-expressions, @typescript-eslint/no-explicit-any */
import * as PIXI from 'pixi.js'

// https://github.com/bfanger/pixi-inspector
// https://github.com/bfanger/pixi-inspector/issues/42#issuecomment-541656994
function registerPixiInspector(): void {
    ;(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
        (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })

    //@ts-expect-error
    globalThis.__PIXI_APP__ = app;
}

//@ts-ignore
global.registerPixiInspector = registerPixiInspector

export { registerPixiInspector }
