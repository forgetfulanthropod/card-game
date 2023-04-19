import './config/nullUtil' // eslint-disable-line import/no-internal-modules
import './util/misc' // eslint-disable-line import/no-internal-modules
import { createRoot } from 'react-dom/client'

import { App } from './components'
import { startLoadingAssets } from './elementsUtil'
import { prepareSocket } from './socket'
import { BUILD_VER } from 'shared'
import { getClientEnv } from './util/getClientEnv'

// @ts-expect-error
window.loadedJs = true // for the password logic in index.html

const reactRoot = document.getElementById('react-root') as HTMLDivElement
const IS_PRODUCTION = getClientEnv('IS_PRODUCTION')
const GAME_IS_LIVE = getClientEnv('GAME_IS_LIVE')

function main() {
    if (IS_PRODUCTION)
        window.addEventListener('contextmenu', e => e.preventDefault())

    if (GAME_IS_LIVE)
        startLoadingAssets().then(() => connectToServerAndRenderUI())
    else connectToServerAndRenderUI()
}

const connectToServerAndRenderUI = () => {
    document.title = `Kaiju Cards ${BUILD_VER}`
    prepareSocket()
    const root = createRoot(reactRoot)
    reactRoot.innerHTML = '' // remove the default warning
    root.render(<App />)
}

void main()
