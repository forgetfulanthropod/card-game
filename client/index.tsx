import './global.css'
import './util/windowUtils'

import { h, render } from 'preact' // eslint-disable-line

import App from '@/components/App'
import { start } from '@/features/battle/elements/main'
import loadAssets from '@/features/battle/logic/AssetLoader'

import { makeNewUser } from './actions'
import { attachServerListener, waitForHandshake } from './connection'
import { waitForGameStateToFill } from './data/rootTree'


console.log(`loaded at ${(new Date()).toLocaleTimeString()}`)
console.log('client build info:', {
    currentBranch: process.env.CLIENT_GIT_BRANCH ?? '',
    lastCommit: process.env.CLIENT_GIT_COMMIT ?? '',
    buildTime: process.env.CLIENT_BUILD_TIME ?? '',
})

const config = {
    log: false,
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
)

void (async function makeTheUser() {
    log('initializing app')
    await waitForHandshake()
    void waitForGameStateToFill().then(() => maybeStart('gamestate'))
    log('making user')
    await makeNewUser({ username: 'alice' })
    maybeStart('createdUser')
})()

function maybeStart<K extends keyof typeof state>(k: K) {
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
