import { getBattleScene, getScene } from '@/data/rootTree'
import { chooseDoor } from '@@/actions/functions'
import { BattleScene } from './BattleScene'
import Chest from './Chest'
import Doors, { DoorsStories } from './Doors'
import { DungeonEntryScene } from './DungeonEntryScene'
import { Application, PixiApplication, PixiContainer } from './mypixi'

const config = {
    showOneThing: null as (null | (() => PixiContainer))
    // showOneThing: () => DoorsStories('log'),
}

export function start(canvas: HTMLCanvasElement): PixiApplication {
    // const scale = window.innerWidth / BASE_WIDTH

    if (config?.showOneThing != null) {
        return Application({ canvas, children: [config?.showOneThing()] })
    }
    const app = Application({ canvas, children: [] })

    bindGamestate(app)

    return app
}


function bindGamestate(app: PixiApplication) {
    let lastScene: PixiContainer | null = null

    const sceneTypeCursor = getScene().select('name')
    sceneTypeCursor.on('update', () => {
        setScene()
    })
    setScene()

    function setScene() {
        if (lastScene !== null) app.stage.removeChild(lastScene)

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
    stateCursor.on('update', () => {
        // if (stateCursor.get() === 'won')

        // if (stateCursor.get() === 'won')
        //     app.stage.addChild(
        //         Chest({ size: { width: app.stage.width, height: app.stage.height } })
        //     )
    })
    const doorCursor = getBattleScene().select('doors')
    let doorsCont: PixiContainer | null = null
    doorCursor.on('update', () => {
        const doors = doorCursor.get()
        if (doors == null && doorsCont != null) {
            app.stage.removeChild(doorsCont)
            doorsCont = null
        } else if (doors != null) {
            doorsCont = Doors({ callbacks: doors.map(d => () => chooseDoor(d)) })
            app.stage.addChild(doorsCont)
        }
    })
}
