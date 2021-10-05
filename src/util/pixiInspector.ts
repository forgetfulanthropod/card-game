// import { PixiApplication } from 'features/battle/elements/mypixi'
import * as PIXI from 'pixi.js'

// export class PixiAppManager {

//     app: PIXI.Application | undefined

//     public createApp(app: PixiApplication): void {
//         this.app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x1099bb })
//         document.body.appendChild(this.app.view)
//         this.registerPixiInspector()
//     }

// https://github.com/bfanger/pixi-inspector
// https://github.com/bfanger/pixi-inspector/issues/42#issuecomment-541656994
export function registerPixiInspector(): void {
    (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ && (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })
}
