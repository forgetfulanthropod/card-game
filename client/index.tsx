import './global.css'

import { render } from 'preact'

import App from './components/App'
import { resolveWhenSocketConfirmed } from './connection'

async function main() {
    await resolveWhenSocketConfirmed()
    render(<App />, document.getElementById('preact-root') as HTMLDivElement)
}

void main()
