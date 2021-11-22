import './global.css'
import './util/windowUtils'

import { h, render } from 'preact' // eslint-disable-line

import { hello } from './actions'
import UsernameEntry from './components/UsernameEntry'

const log = (...args: unknown[]) => true && console.log(args)

log(`loaded at ${(new Date()).toLocaleTimeString()}`)
log('client build info:', {
    currentBranch: process.env.CLIENT_GIT_BRANCH ?? '',
    lastCommit: process.env.CLIENT_GIT_COMMIT ?? '',
    buildTime: process.env.CLIENT_BUILD_TIME ?? '',
})

void hello().then(res => log('hello got', res))

render(<UsernameEntry />, document.getElementById('preact-root') as HTMLDivElement)
