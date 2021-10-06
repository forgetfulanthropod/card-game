import App from 'components/App'
import { start } from 'features/battle/elements/main'
import { tl } from 'features/battle/logic/allCharactersLogic'
import loadAssets from 'features/battle/logic/AssetLoader'
import { render } from 'preact'
import './global.css'

render(<App />, document.getElementById('preact-root') as HTMLDivElement)

let started = false
loadAssets(
    function onBasic() {
    },
    function onDeluxe() {
        if (!started)
            start(document.getElementById('pixi-root') as HTMLCanvasElement)
        started = true
    }
)
