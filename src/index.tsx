// import { start } from 'newbattle/newbattle'
import { render, h } from 'preact'
import './global.css'
import App from 'components/App'
// /** @jsx h */

// const App = () => {
//     const [input, setInput] = useState('')

//     if (Math.random() > .5) {
//         // CURRENT POINT
//         // const garbage = useState()
//     }
//     return (
//         <div>
//             <p>Do you agree to the statement: {'"Preact is awesome"'}?</p>
//             <input value={input} onChange={e => setInput(e.target.value)} />

//         </div>
//     )
// }

render(<App />, document.getElementById('preact-root') as HTMLDivElement)

// start(document.getElementById('pixi-root') as HTMLCanvasElement)
