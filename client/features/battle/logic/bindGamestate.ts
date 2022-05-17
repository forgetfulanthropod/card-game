import { TwistFilter } from 'pixi-filters'
import { Easing, Tweener } from 'pixi-tweener'
import type { SceneType } from 'shared'

import { getBattleScene, getScene } from '@/data/rootTree'
import type { PixiApplication, PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT } from '@/elementsUtil'
import { BASE_WIDTH } from '@/elementsUtil'
import { localBus } from '@/util'

import pointer from '../../../assets/mouse.png'
import { BattleScene } from '../elements/BattleScene'
import Chest from '../elements/Chest'
import { DungeonEntryScene } from '../elements/DungeonEntryScene'

let lastScene: PixiContainer

export function bindGamestate(app: PixiApplication): void {
    setBodyStyles()

    bindScene(app)
}

function setBodyStyles() {
    document.body.style.cursor = 'pointer'
    document.body.style.cursor = `url('${pointer}'), pointer`
}

function bindScene(app: PixiApplication) {
    const sceneTypeCursor = getScene().select('name')

    sceneTypeCursor.on('update', () => {
        void setScene()
    })

    void setScene()

    async function setScene(): Promise<void> {
        const sceneType = sceneTypeCursor.get()

        if (lastScene != null) {
            await localBus.sceneChange(sceneType)
            await animateTo(lastScene, sceneType)

            app.stage.removeChild(lastScene)
        }

        if (sceneType === 'battle') {
            lastScene = BattleScene()
            bindBattleState(app)
        } else if (sceneType === 'entry') {
            lastScene = DungeonEntryScene()
        } else {
            throw new Error('what!')
        }
        app.stage.addChild(lastScene)
    }
}

const twistFilter = new TwistFilter({
    angle: 4,
    radius: 0,
})
twistFilter.offset.x = BASE_WIDTH / 2
twistFilter.offset.y = BASE_HEIGHT / 2

async function animateTo(
    sceneEl: PixiContainer,
    sceneType: SceneType
): Promise<void> {
    if (sceneType === 'battle') {
        sceneEl.filters = [twistFilter]

        await Tweener.add(
            { target: twistFilter, duration: 3, ease: Easing.easeInOutCubic },
            {
                radius: 1080,
            }
        )

        // debugger

        // const startTime = Date.now()
        // setInterval(() => {
        //     darkenFilter.
        // }, 33)

        // await fromTo(
        //     darkenFilter,
        //     1,
        //     {
        //         contrast: 1,
        //         brightness: 1,
        //     },
        //     {
        //         contrast: 0,
        //         brightness: 0.5,
        //     }
        // )

        // await gsap.fromTo(
        //     darkenFilter,
        //     {
        //         contrast: 1,
        //         birghtness: 1,
        //     },
        //     {
        //         contrast: 0,
        //         birghtness: 0.5,
        //         duration: 10,
        //     }
        // )

        // debugger
    }
}

// function fromTo<T>(
//     graphicsObject: T,
//     //@seconds
//     duration: number,
//     from: Partial<T>,
//     to: Partial<T>
// ): Promise<void> {
//     Object.keys(from).forEach(
//         //@ts-expect-error
//         fromKey => (graphicsObject[fromKey] = from[fromKey])
//     )

//     const app = getPixiApp()
//     app.ticker.add(tween)

//     app.ticker.remove(tween)

//     const resolveOnComplete = (resolve: () => void) => {
//         resolve()
//     }

//     return new Promise(resolveOnComplete)

//     function tween() {}
// }

function bindBattleState(app: PixiApplication) {
    const stateCursor = getBattleScene().select('state')
    let chest: PixiContainer | null = null
    stateCursor.on('update', () => {
        if (stateCursor.get() === 'won') {
            chest = Chest({
                size: { width: app.stage.width, height: app.stage.height },
            })
            app.stage.addChild(chest)
        } else if (chest != null) {
            app.stage.removeChild(chest)
            chest.destroy()
            chest = null
        }
    })
}
