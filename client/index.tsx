// import { helloWorld } from '@/api'
import './global.css'

import { render } from 'preact'

import App from '@/components/App'
import { start } from '@/features/battle/elements/main'
import loadAssets from '@/features/battle/logic/AssetLoader'

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

// helloWorld()
