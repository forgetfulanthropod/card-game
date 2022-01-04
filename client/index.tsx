import './global.css'

import { render } from 'preact'

import App from './components/App'
import { resolveWhenSocketConfirmed } from './connection'

const clientBuildInfo = {
    gitBranch: process.env.CLIENT_GIT_BRANCH ?? '',
    gitCommit: process.env.CLIENT_GIT_COMMIT ?? '',
    buildTime: process.env.CLIENT_BUILD_TIME ?? '',
}
console.log('client build info:', JSON.stringify(clientBuildInfo))

async function main() {
    await resolveWhenSocketConfirmed()
    const preactRoot = document.getElementById('preact-root') as HTMLDivElement
    preactRoot.innerHTML = '' // remove the default warning
    render(<App />, preactRoot)
}

void main()
