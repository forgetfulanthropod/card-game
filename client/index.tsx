import './config/nullUtil' // eslint-disable-line import/no-internal-modules
import './util/misc' // eslint-disable-line import/no-internal-modules
import { createRoot } from 'react-dom/client'

import { App } from './components'
import { startLoadingAssets } from './elementsUtil'
import { prepareSocket } from './socket'
import { BUILD_VER } from 'shared'
import { getClientEnv } from './util/getClientEnv'

// @ts-expect-error
window.loadedJs = true

const reactRoot = document.getElementById('react-root') as HTMLDivElement
const IS_PRODUCTION = getClientEnv('IS_PRODUCTION')

function main() {
    // render UI immediately; kick off asset preload in background (needed for pixi later)
    try {
        connectToServerAndRenderUI()
    } catch (e) {
        console.error('Failed to bootstrap React app', e)
        const rootEl = document.getElementById('react-root')
        if (rootEl) {
            rootEl.innerHTML = `<div style="color:white;padding:20px;font-family:sans-serif">Failed to start Kaiju Cards.<br/>${String(e)}<br/><br/>Check console / logcat. Try setting localStorage 'serverHost' and reload.</div>`
        }
    }
    startLoadingAssets().catch(err => console.error('asset preload failed', err))
}

const connectToServerAndRenderUI = () => {
    document.title = `Kaiju Cards ${BUILD_VER}`
    prepareSocket()
    const rootEl = document.getElementById('react-root')
    if (!rootEl) {
        console.error('react-root element not found! HTML structure issue in WebView/Capacitor?')
        document.body.style.background = 'black'
        document.body.innerHTML += '<div style="color:white;padding:20px">react-root missing. Bundle may have loaded wrong HTML.</div>'
        return
    }
    rootEl.innerHTML = '' // remove the default "Loading..." placeholder before mounting React
    const root = createRoot(rootEl)
    root.render(<App />)
}

void main()

// Dev helper: open the all-characters animation showcase screen
// Usage in console: window.showAllCharacterAnims()
;(window as any).showAllCharacterAnims = () => {
  try {
    // @ts-ignore
    import('@/callApi').then(({ callApi }) => callApi('changeScene', { newSceneName: 'showcase' } as any))
  } catch (e) {
    console.warn('could not trigger showcase via api, falling back to direct scene id')
    try {
      // @ts-ignore
      const { getScene } = require('@/data')
      getScene().set('id', 'showcase')
    } catch {}
  }
}
