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

// Make sure we can see the React content (main menu) even if pixi or other things interfere
document.body.style.background = '#000'
if (reactRoot) {
    reactRoot.style.position = 'absolute'
    reactRoot.style.top = '0'
    reactRoot.style.left = '0'
    reactRoot.style.width = '100%'
    reactRoot.style.height = '100%'
    reactRoot.style.zIndex = '10'
}

// Do NOT remove the loading gif at top-level before we know render succeeded.
// Removing it early + render failure = blank screen ("no loading modal").
function removeLoadingPlaceholder() {
    const loadingImg = document.querySelector('img[src*="loading.gif"]') as HTMLElement | null
    if (loadingImg && loadingImg.parentNode) {
        loadingImg.parentNode.removeChild(loadingImg)
    }
    const staticLabel = document.getElementById('static-loading')
    if (staticLabel && staticLabel.parentNode) {
        staticLabel.parentNode.removeChild(staticLabel)
    }
}

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

// Global error hooks so we at least show *something* instead of silent blank when broken.
function installErrorHandlers(rootEl: HTMLElement | null) {
    let bootComplete = false
    const showErr = (msg: string) => {
        if (bootComplete) {
            console.error('Runtime error:', msg)
            return
        }
        console.error('BOOT ERROR:', msg)
        if (rootEl) {
            rootEl.innerHTML = `<div style="color:#ffdddd;background:#300;padding:16px;font:14px/1.4 sans-serif;position:absolute;inset:0;z-index:9999"><b>Kaiju Cards failed to start.</b><br/>${msg}<br/><br/>Hard refresh (Ctrl+Shift+R). Check console. Try ?server= override if remote.</div>`
        }
    }
    window.addEventListener('error', (e) => showErr(e.message || String(e.error || e)))
    window.addEventListener('unhandledrejection', (e) => showErr('unhandled: ' + (e.reason?.message || e.reason)))
    return { showErr, markBootComplete: () => { bootComplete = true } }
}

const connectToServerAndRenderUI = () => {
    document.title = `Kaiju Cards ${BUILD_VER}`
    prepareSocket()
    const rootEl = document.getElementById('react-root')
    const { showErr, markBootComplete } = installErrorHandlers(rootEl)
    if (!rootEl) {
        console.error('react-root element not found! HTML structure issue in WebView/Capacitor?')
        document.body.style.background = 'black'
        document.body.innerHTML += '<div style="color:white;padding:20px">react-root missing. Bundle may have loaded wrong HTML.</div>'
        return
    }
    rootEl.innerHTML = '' // clear before mount
    const root = createRoot(rootEl)
    try {
        root.render(<App />)
        // Remove placeholder only after we attempted to mount the UI
        // Use rAF so first paint can happen; menu content should cover or replace.
        requestAnimationFrame(() => {
            removeLoadingPlaceholder()
            markBootComplete()
        })
        // Extra safety: if still empty after a tick, show hint (no crash case)
        setTimeout(() => {
            if (rootEl && rootEl.children.length === 0 && !rootEl.textContent?.trim()) {
                rootEl.innerHTML = '<div style="color:#aaa;padding:12px;font-family:sans-serif;opacity:0.7">Loading Kaiju Cards menu...</div>'
            }
        }, 1200)
    } catch (e: any) {
        showErr(String(e))
        removeLoadingPlaceholder()
    }
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
