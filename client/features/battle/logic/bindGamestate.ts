import { chooseDoor, exitDungeon } from '@/actions'
import { getBattleScene, getScene } from '@/data/rootTree'
import type { PixiApplication, PixiContainer } from '@/elementsUtil/mypixi'

import pointer from '../../../assets/mouse.png'
import { BattleScene } from '../elements/BattleScene'
import Chest from '../elements/Chest'
import Doors from '../elements/Doors'
import { DungeonEntryScene } from '../elements/DungeonEntryScene'

export function bindGamestate(app: PixiApplication) {
    let lastScene: PixiContainer | null = null

    document.body.style.cursor = 'pointer'
    document.body.style.cursor = `url('${pointer}'), pointer`

    const sceneTypeCursor = getScene().select('name')
    sceneTypeCursor.on('update', () => {
        setScene()
    })
    setScene()

    function setScene() {
        if (lastScene !== null)
            app.stage.removeChild(lastScene)

        const sceneType = sceneTypeCursor.get()
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

function bindBattleState(app: PixiApplication) {

    const stateCursor = getBattleScene().select('state')
    let chest: PixiContainer | null = null
    stateCursor.on('update', () => {
        if (stateCursor.get() === 'won') {
            chest = Chest({ size: { width: app.stage.width, height: app.stage.height } })
            app.stage.addChild(chest)
        } else if (chest != null) {
            app.stage.removeChild(chest)
            chest.destroy()
            chest = null
        }
    })
    const doorCursor = getBattleScene().select('doors')
    let doorsCont: PixiContainer | null = null
    doorCursor.on('update', () => {
        const doors = doorCursor.get()
        if ((doors == null || doors.options.length === 0) && doorsCont != null) {
            app.stage.removeChild(doorsCont)
            doorsCont = null
        } else if (doors != null) {
            doorsCont = Doors({
                callbacks: doors.options.map(d => () => chooseDoor({ door: d })),
                descriptions: doors.descriptions,
                exit: () => exitDungeon({}),
            })
            app.stage.addChild(doorsCont)
        }
    })
}
