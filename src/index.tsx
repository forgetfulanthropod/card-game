import App from 'components/App'
import { start } from 'features/battle/elements/main'
import loadAssets from 'features/battle/logic/AssetLoader'
import { render } from 'preact'
import './global.css'

render(<App />, document.getElementById('preact-root') as HTMLDivElement)

loadAssets(
    function onBasic() {
    },
    function onDeluxe() {
        start(document.getElementById('pixi-root') as HTMLCanvasElement)

    }
)
