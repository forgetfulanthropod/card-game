// import { start } from 'newbattle/newbattle'
import { render, h } from 'preact'
import './global.css'
import App from 'components/App'
import { start } from 'features/battle/pixijs/main'

render(<App />, document.getElementById('preact-root') as HTMLDivElement)

start(document.getElementById('pixi-root') as HTMLCanvasElement)
