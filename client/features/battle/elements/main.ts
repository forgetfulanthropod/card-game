import { getBattleScene, getScene } from '@/data/rootTree'
import { BattleScene } from './BattleScene'
import Chest from './Chest'
import { DungeonEntryScene } from './DungeonEntryScene'
import { Application, PixiApplication, PixiContainer } from './mypixi'

export function start(canvas: HTMLCanvasElement): PixiApplication {
    // const scale = window.innerWidth / BASE_WIDTH

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
        if (stateCursor.get() === 'won')
            app.stage.addChild(
                Chest({ size: { width: app.stage.width, height: app.stage.height } })
            )
    })
}
