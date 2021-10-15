// import { helloWorld } from '@/api'
import './global.css'

import { render } from 'preact'

import App from '@/components/App'
import { start } from '@/features/battle/elements/main'
import loadAssets from '@/features/battle/logic/AssetLoader'

import { onGamestate, onRulebook } from './data/rootTree'

render(<App />, document.getElementById('preact-root') as HTMLDivElement)

const state = {
    started: false,
    basic: false,
    deluxe: false,
    rulebook: false,
    gamestate: false,
}

loadAssets(
    function onBasic() { maybeStart('basic') },
    function onDeluxe() { maybeStart('deluxe') }
)

onRulebook(() => maybeStart('rulebook'))
onGamestate(() => maybeStart('gamestate'))


function maybeStart<K extends keyof typeof state>(k: K) {
    if (!state[k]) {
        console.log(`loaded: ${k}`)
    }
    state[k] = true
    if (state.basic && state.deluxe && state.rulebook && state.gamestate && !state.started) {
        console.log('everything loaded up. starting app.')
        start(document.getElementById('pixi-root') as HTMLCanvasElement)
        state.started = true
    }
}

setTimeout(() => alert(`reload at ${(new Date()).toLocaleTimeString()}`), 1000)

// helloWorld()
