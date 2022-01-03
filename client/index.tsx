// import { render } from 'preact'

// import App from './components/App'
import { Application } from './elementsUtil'
import { Gather } from './features/gather'

const app = Application({ canvas: document.getElementById('pixi-root') as HTMLCanvasElement, children: [] })
app.stage.addChild(Gather())
/* Graphics({
        draw: g => {
            g.beginFill(0xff0000)
            g.drawCircle(0, 0, 100)
            g.endFill()
        },
    })
) */
// render(<App />, document.getElementById('preact-root') as HTMLDivElement)

/*
import './global.css'
import './util/windowUtils'

import { h, render } from 'preact' // eslint-disable-line

import loadAssets from '@/features/battle/logic/AssetLoader'

import { hello } from './actions'
import App from './components/App'
// import GameManager from './components/GameManager'
// import App from './components/UsernameEntry2'
import { resolveWhenSocketConfirmed } from './connection'

const log = (...args: unknown[]) => true && console.log(...args)

log(`loaded at ${new Date().toLocaleTimeString()}`)
log('client build info:', {
    currentBranch: process.env.CLIENT_GIT_BRANCH ?? '',
    lastCommit: process.env.CLIENT_GIT_COMMIT ?? '',
    buildTime: process.env.CLIENT_BUILD_TIME ?? '',
})

void hello().then(res => log('hello got', res))

async function main() {
    maybeMakeSocket()
    await Promise.all([resolveWhenSocketConfirmed(), loadAssets()])

    render(<App />, document.getElementById('preact-root') as HTMLDivElement)
}
void main()
 */
