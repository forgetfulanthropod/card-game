import './global.css'

import { render } from 'preact'

import App from '@/components/App'
import { start } from '@/features/battle/elements/main'
import loadAssets from '@/features/battle/logic/AssetLoader'

import { makeNewUser } from './actions'
import { waitForGameStateToFill } from './data/rootTree'
import { maybeInitializeApp } from './connection'
import { attachServerListener, waitForHandshake } from './connection/serverListener'

console.log(`app built at ${process.env.buildTime} and loaded at ${(new Date()).toLocaleTimeString()}`)

const config = {
    log: true
}

function log(...args: unknown[]) {
    if (config.log) { console.log(...args) }
}

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
);

(async function makeTheUser() {
    // TODO: check if this await actually waits all the way through
    log('initializing app')
    maybeInitializeApp()
    await waitForHandshake()
    waitForGameStateToFill().then(() => maybeStart('gamestate'))
    log('making user')
    await makeNewUser({ username: 'alice' })
    maybeStart('createdUser')
})()

async function maybeStart<K extends keyof typeof state>(k: K) {
    if (!state[k]) {
        log(`loaded: ${k}`)
    }
    state[k] = true
    if (state.basic && state.deluxe && state.gamestate && state.createdUser && !state.started) {
        log('everything loaded up')
        log('attaching server data listener')
        attachServerListener()
        // log('changing scene')
        // await changeScene({ newSceneName: 'battle' })
        log('starting preact')
        render(<App />, document.getElementById('preact-root') as HTMLDivElement)
        log('starting pixi')
        start(document.getElementById('pixi-root') as HTMLCanvasElement)
        state.started = true
    }
}
