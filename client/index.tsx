import 'preact/debug'
import './config/nullUtil'

import { render } from 'preact'

import App from './components/App'
import { resolveWhenSocketConfirmed, startRetrying } from './connection'

// @ts-expect-error
window.loadedJs = true // for the password logic in index.html

const clientBuildInfo = {
    gitBranch: process.env.CLIENT_GIT_BRANCH ?? '',
    gitCommit: process.env.CLIENT_GIT_COMMIT ?? '',
    buildTime: process.env.CLIENT_BUILD_TIME ?? '',
}
console.log('client build info:', JSON.stringify(clientBuildInfo))

const preactRoot = document.getElementById('preact-root') as HTMLDivElement

async function main() {
    await resolveWhenSocketConfirmed()
    startRetrying()
    preactRoot.innerHTML = '' // remove the default warning
    render(<App />, preactRoot)
}
void main()
