import './global.css'
import './util/windowUtils'

import { h, render } from 'preact' // eslint-disable-line

import loadAssets from '@/features/battle/logic/AssetLoader'

import { hello } from './actions'
import UsernameEntry from './components/UsernameEntry'
import { waitForHey } from './connection'

const log = (...args: unknown[]) => true && console.log(...args)

log(`loaded at ${(new Date()).toLocaleTimeString()}`)
log('client build info:', {
    currentBranch: process.env.CLIENT_GIT_BRANCH ?? '',
    lastCommit: process.env.CLIENT_GIT_COMMIT ?? '',
    buildTime: process.env.CLIENT_BUILD_TIME ?? '',
})

void hello().then(res => log('hello got', res))

async function main() {
    await Promise.all([
        waitForHey(),
        loadAssets(),
    ])

    render(<UsernameEntry />, document.getElementById('preact-root') as HTMLDivElement)
}
void main()
