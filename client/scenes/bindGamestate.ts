import type { SceneType } from 'shared'

import { AdjustmentFilter } from 'pixi-filters'
import { Easing, Tweener } from 'pixi-tweener'
import { BattleScene } from './battle'
import { DungeonEntryScene } from './entry'
import { getScene } from '@/data'
import type { PixiApplication, PixiContainer } from '@/elementsUtil'
import { animation$, nextFrame, onUpdate } from '@/util'

const pointerFullPath = 'assets/root/mouse.png'
let lastScene: PixiContainer

export function bindGamestate(app: PixiApplication): void {
    setBodyStyles()

    bindScene(app)
}

function setBodyStyles() {
    document.body.style.cursor = 'pointer'
    document.body.style.cursor = `url('${pointerFullPath}'), pointer`
}

function bindScene(app: PixiApplication): Unbind {
    return onUpdate(getScene().select('name'), setScene, true)
    async function setScene(sceneType: SceneType): Promise<void> {
        if (lastScene != null) {
            await nextFrame()
            if (sceneType === 'battle')
                await animation$.readAssert('scene exit done')

            await transitionScene(lastScene, 'out')

            app.stage.removeChild(lastScene)
            lastScene.destroy({ children: true })
        }

        if (sceneType === 'battle') {
            lastScene = BattleScene()
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

export const TRANSITION_SECONDS = 0.25

async function transitionScene(
    sceneEl: PixiContainer,
    direction: 'out' | 'in'
): Promise<void> {
    const brightnessFrom = direction === 'out' ? 1 : 0
    const brightnessTo = direction === 'out' ? 0 : 1

    const filter = new AdjustmentFilter({
        brightness: brightnessFrom,
    })
    sceneEl.filters = [filter]
    await Tweener.add(
        {
            target: filter,
            duration: TRANSITION_SECONDS,
            ease: Easing.easeInExpo,
        },
        {
            brightness: brightnessTo,
        }
    ).then(() => {
        sceneEl.filters = null
        Tweener.killTweensOf(filter)
        setTimeout(() => filter.destroy(), 1000) // next frame destruction no bueno...
        // filter.destroy()
    })
}

// function bindBattleState(app: PixiApplication) {
//     const stateCursor = getBattleScene().select('state')
//     let chest: PixiContainer | null = null
//     stateCursor.on('update', () => {
//         if (stateCursor.get() === 'won') {
//             chest = Chest({
//                 size: { width: app.stage.width, height: app.stage.height },
//             })
//             app.stage.addChild(chest)
//         } else if (chest != null) {
//             app.stage.removeChild(chest)
//             chest.destroy()
//             chest = null
//         }
//     })
// }
