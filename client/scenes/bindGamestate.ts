import type { SceneId } from 'shared'

import { RunSceneManager } from './run'
import { DungeonEntryScene } from './entry'
import { CharacterShowcaseScene } from './CharacterShowcaseScene'
import { getScene } from '@/data'
import type { PixiApplication, PixiContainer } from '@/elementsUtil'
import { nextFrame, onUpdate } from '@/util'
import { transitionScene } from './shared/transitionScene'

// Worlds and PVP MUST extend DungeonEntryScene (enforced in source + tests)
import { WorldsScene } from './entry/WorldsScene'
import { PVPScene } from './entry/PVPScene'
import { DailyScene } from './entry/DailyScene'

const defaultPointerFullPath = 'assets/root/mouse.webp'
const hoverPointerFullPath = 'assets/root/hand.webp'
let lastScene: PixiContainer

export function bindGamestate(app: PixiApplication): void {
    setBodyStyles(app)

    bindScene(app)
}

function setBodyStyles(app: PixiApplication) {
    const defaultIcon = `url('${defaultPointerFullPath}'),default`
    const defaultFallbackIcon = `url('${defaultPointerFullPath}'),default` // used when toggling cursor off
    const hoverIcon = `url('${hoverPointerFullPath}'),pointer`
    const hiddenIcon = 'none'

    app.renderer.events.cursorStyles.default = defaultIcon
    app.renderer.events.cursorStyles.defaultFallback = defaultFallbackIcon
    app.renderer.events.cursorStyles.hover = hoverIcon
    app.renderer.events.cursorStyles.hidden = hiddenIcon
}

function bindScene(app: PixiApplication): Unbind {
    return onUpdate(getScene().select('id'), setScene, true)
    async function setScene(sceneType: SceneId): Promise<void> {
        if (lastScene != null) {
            await nextFrame()
            // if (sceneType === 'battle')
            //     await animation$.readAssert('scene exit done')

            await transitionScene(lastScene, 'out')

            app.stage.removeChild(lastScene)
            lastScene.destroy({ children: true })
        }

        if (sceneType === 'battle') {
            lastScene = RunSceneManager()
            // bindBattleState(app)
        } else if (sceneType === 'entry') {
            lastScene = new DungeonEntryScene()
        } else if (sceneType === 'worlds') {
            lastScene = new WorldsScene()
        } else if (sceneType === 'pvp') {
            lastScene = new PVPScene()
        } else if (sceneType === 'daily') {
            lastScene = new DailyScene()
        } else if (sceneType === 'showcase') {
            lastScene = CharacterShowcaseScene()
        } else if (sceneType === 'shop' || sceneType === 'creator') {
            // stub scenes reuse base entry for now (or dedicated later)
            lastScene = new DungeonEntryScene()
        } else {
            throw new Error('what! unknown scene: ' + sceneType)
        }
        app.stage.addChild(lastScene)

        await transitionScene(lastScene, 'in')
    }
}
