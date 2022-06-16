import 'preact/debug'

import './config/nullUtil' // eslint-disable-line import/no-internal-modules
import './util/misc' // eslint-disable-line import/no-internal-modules
import { render } from 'preact'

import { App } from './components'
import { startLoadingAssets } from './elementsUtil'
import { prepareSocket } from './socket'

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
    timelog('waiting for socket')
    startLoadingAssets()
    prepareSocket()
    preactRoot.innerHTML = '' // remove the default warning
    timelog('rendering app')
    render(<App />, preactRoot)
}
void main()
