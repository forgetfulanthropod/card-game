/* eslint-disable no-unused-expressions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-extra-semi */
import * as PIXI from 'pixi.js'

// https://github.com/bfanger/pixi-inspector
// https://github.com/bfanger/pixi-inspector/issues/42#issuecomment-541656994
export function registerPixiInspector(): void {
    ;(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
        (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })
}
