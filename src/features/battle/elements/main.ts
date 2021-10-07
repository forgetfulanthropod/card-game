import { getScene } from 'data/rootTree'
import { BattleScene } from './BattleScene'
import background from './background'
import Chest from './Chest'
import { Application, PixiApplication } from './mypixi'
import { DungeonEntryScene } from './DungeonEntryScene'

export function start(canvas: HTMLCanvasElement): PixiApplication {
    // const scale = window.innerWidth / BASE_WIDTH

    const app = Application({ canvas, children: [] })

    bindGamestate(app)

    bindBattleState(app)

    return app
}


function bindGamestate(app: PixiApplication) {
    const battleScene = BattleScene()
    const dungeonEntryScene = DungeonEntryScene()

    const sceneTypeCursor = getScene().select('type')
    sceneTypeCursor.on('update', () => {
        setScene()
    })
    setScene()

    function setScene() {
        if (sceneTypeCursor.get() === 'battle') {
            app.stage.removeChild(dungeonEntryScene)
            app.stage.addChild(battleScene)
        }
        if (sceneTypeCursor.get() === 'dungeon entry') {
            app.stage.removeChild(battleScene)
            app.stage.addChild(dungeonEntryScene)
        }
    }
}

function bindBattleState(app: PixiApplication) {

    const stateCursor = getScene().select('state')
    stateCursor.on('update', () => {
        if (stateCursor.get() === 'won')
            app.stage.addChild(
                Chest({ size: { width: app.stage.width, height: app.stage.height } })
            )
    })
}
