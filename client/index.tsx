// import 'preact/debug'

import './config/nullUtil' // eslint-disable-line import/no-internal-modules
import './util/misc' // eslint-disable-line import/no-internal-modules
import { render } from 'react-dom'

import { App } from './components'
import { startLoadingAssets } from './elementsUtil'
import { prepareSocket } from './socket'
import { BUILD_VER } from 'shared'
import { checkClientEnv, getClientEnv } from './util/getClientEnv'

// @ts-expect-error
window.loadedJs = true // for the password logic in index.html

const preactRoot = document.getElementById('preact-root') as HTMLDivElement
const IS_PRODUCTION = getClientEnv('IS_PRODUCTION')
const GAME_IS_LIVE = getClientEnv('GAME_IS_LIVE')
checkClientEnv()

function main() {
    if (GAME_IS_LIVE) {
        startLoadingAssets()
    }

    if (IS_PRODUCTION) {
        // disable right clicks
        window.addEventListener('contextmenu', e => {
            e.preventDefault()
        })
    }
    document.title = `Kaiju Cards ${BUILD_VER}`
    prepareSocket()
    preactRoot.innerHTML = '' // remove the default warning
    render(<App />, preactRoot)
}
void main()
