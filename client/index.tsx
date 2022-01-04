import './global.css'

import { h, JSX, render } from 'preact'

import App from './components/App'

render(<App />, document.getElementById('preact-root') as HTMLDivElement)
