import './global.css'

import { render } from 'preact'

import App from '@/components/App'
import { start } from '@/features/battle/elements/main'
import loadAssets from '@/features/battle/logic/AssetLoader'

import { changeScene, makeNewUser } from './actions'
import { fillBothTrees, onGamestate, onRulebook } from './data/rootTree'
import { maybeInitializeApp } from './fire'

console.log(`app built at ${process.env.buildTime} and loaded at ${(new Date()).toLocaleTimeString()}`)

const state = {
    started: false,
    createdUser: false,
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
onGamestate(() => maybeStart('gamestate'));

(async function makeTheUser() {
    // TODO: check if this await actually waits all the way through
    console.log('initializing app')
    maybeInitializeApp()
    console.log('making user')
    await makeNewUser({ username: 'alice' })
    state.createdUser = true
    fillBothTrees()
})()

async function maybeStart<K extends keyof typeof state>(k: K) {
    if (!state[k]) {
        console.log(`loaded: ${k}`)
    }
    state[k] = true
    if (state.basic && state.deluxe && state.rulebook && state.gamestate && state.createdUser && !state.started) {
        console.log('everything loaded up. starting app.')
        console.log('well, changing scene first.')
        await changeScene({ newSceneName: 'battle' })
        render(<App />, document.getElementById('preact-root') as HTMLDivElement)
        start(document.getElementById('pixi-root') as HTMLCanvasElement)
        state.started = true
    }
}
