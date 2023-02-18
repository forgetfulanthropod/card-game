import type { SceneId } from 'shared'

import { RunSceneManager } from './run'
import { DungeonEntryScene } from './entry'
import { getScene } from '@/data'
import type { PixiApplication, PixiContainer } from '@/elementsUtil'
import { nextFrame, onUpdate } from '@/util'
import { transitionScene } from './shared/transitionScene'

const pointerFullPath = 'assets/root/mouse.webp'
let lastScene: PixiContainer

export function bindGamestate(app: PixiApplication): void {
    setBodyStyles()

    bindScene(app)
}

function setBodyStyles() {
    document.body.style.cursor = `url('${pointerFullPath}'), default`
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
            lastScene = DungeonEntryScene()
        } else {
            throw new Error('what!')
        }
        app.stage.addChild(lastScene)

        await transitionScene(lastScene, 'in')
    }
}
