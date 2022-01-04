import './global.css'
import 'preact/debug'

import { h, JSX, render } from 'preact' // eslint-disable-line

import { TempApp } from './components/PageManager'

// import { Application } from './elementsUtil'
// import { Gather } from './features/gather'

// const app = Application({ canvas: document.getElementById('pixi-root') as HTMLCanvasElement, children: [] })
// app.stage.addChild(Gather())
/* Graphics({
        draw: g => {
            g.beginFill(0xff0000)
            g.drawCircle(0, 0, 100)
            g.endFill()
        },
    })
) */
render(<TempApp />, document.getElementById('preact-root') as HTMLDivElement)
