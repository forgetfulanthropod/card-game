import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import _Export from './types'

import './global.css'
import { makeCall } from 'fire'

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)

makeCall()
