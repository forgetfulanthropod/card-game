//@ts-ignore
import _ from 'ts-node/register' // debugging
import express from 'express'
// @ts-ignore
const app = express()

export function getApp() {
    return app
}

const port = 3002

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
// app.get('/hi', (req, res) => {
//     res.send('hi there')
// })

import { doIt } from './functions'
doIt()
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
