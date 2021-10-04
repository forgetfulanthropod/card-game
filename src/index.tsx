// import { start } from 'newbattle/newbattle'
import App from 'components/App'
import { start } from 'features/battle/pixijs/main'
import { render } from 'preact'
import './global.css'

render(<App />, document.getElementById('preact-root') as HTMLDivElement)

start(document.getElementById('pixi-root') as HTMLCanvasElement)
