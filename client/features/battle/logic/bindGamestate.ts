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
            { target: twistFilter, duration: 1, ease: Easing.easeInExpo },
            {
                radius: 1080,
            }
        )
    }
}

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
