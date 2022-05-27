import { TwistFilter } from 'pixi-filters'
import type { SceneType } from 'shared'

import { Easing, Tweener } from 'pixi-tweener'
import { BattleScene } from './battle'
import { DungeonEntryScene } from './entry'
import { pointer } from '@/assets'
import { getScene } from '@/data'
import type { PixiApplication, PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import {
    nextFrame,
    onUpdate,
    waitingForSceneExitAnimationToFinish,
} from '@/util'

let lastScene: PixiContainer

export function bindGamestate(app: PixiApplication): void {
    setBodyStyles()

    bindScene(app)
}

function setBodyStyles() {
    document.body.style.cursor = 'pointer'
    document.body.style.cursor = `url('${pointer}'), pointer`
}

function bindScene(app: PixiApplication): Unbind {
    return onUpdate(getScene().select('name'), setScene, true)
    async function setScene(sceneType: SceneType): Promise<void> {
        if (lastScene != null) {
            await nextFrame()
            if (waitingForSceneExitAnimationToFinish.val === true) {
                await new Promise(resolve =>
                    waitingForSceneExitAnimationToFinish.onChange(
                        (_, __, unsub) => {
                            unsub()
                            resolve(null)
                        }
                    )
                )
            }

            await transitionSceneTo(lastScene, sceneType)

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
    }
}

export const TRANSITION_OUT_SECONDS = 1

async function transitionSceneTo(
    sceneEl: PixiContainer,
    sceneType: SceneType
): Promise<void> {
    const twistFilter = new TwistFilter({
        angle: 4,
        radius: 0,
    })
    twistFilter.offset.x = BASE_WIDTH / 2
    twistFilter.offset.y = BASE_HEIGHT / 2
    if (sceneType === 'battle') {
        sceneEl.filters = [twistFilter]
        await Tweener.add(
            {
                target: twistFilter,
                duration: TRANSITION_OUT_SECONDS,
                ease: Easing.easeInExpo,
            },
            {
                radius: 1080,
            }
        ).then(() => {
            twistFilter.radius = 0
        })
    }
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
