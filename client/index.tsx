import './global.css'

import { render } from 'preact'

import App from './components/App'
import { resolveWhenSocketConfirmed } from './connection'

async function main() {
    await resolveWhenSocketConfirmed()
    const preactRoot = document.getElementById('preact-root') as HTMLDivElement
    preactRoot.innerHTML = '' // remove the default warning
    render(<App />, preactRoot)
}

void main()
