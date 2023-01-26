// import 'preact/debug'

import './config/nullUtil' // eslint-disable-line import/no-internal-modules
import './util/misc' // eslint-disable-line import/no-internal-modules
import { render } from 'react-dom'

import { App } from './components'
import { startLoadingAssets } from './elementsUtil'
import { prepareSocket } from './socket'
import { GAME_IS_LIVE } from './components/NewStartScreen'

// @ts-expect-error
window.loadedJs = true // for the password logic in index.html

const clientBuildInfo = {
    gitBranch: process.env.CLIENT_GIT_BRANCH ?? '',
    gitCommit: process.env.CLIENT_GIT_COMMIT ?? '',
    buildTime: process.env.CLIENT_BUILD_TIME ?? '',
}
console.log('client build info:', JSON.stringify(clientBuildInfo))

const preactRoot = document.getElementById('preact-root') as HTMLDivElement

function main() {
    if (GAME_IS_LIVE) {
        startLoadingAssets()
    }
    prepareSocket()
    preactRoot.innerHTML = '' // remove the default warning
    render(<App />, preactRoot)
}
void main()
