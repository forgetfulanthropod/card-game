import { spawnSync } from 'child_process'
import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'

import { attachAPIRoutes } from './functions'

const gitBranch = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { encoding: 'utf8' })?.output?.[1]?.trim()
console.log('serving from branch', gitBranch)


const port = 3000

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const http = new HttpServer(app)
const io = new SocketServer(http)


export function getIo(): typeof io {
    return io
}

export function getApp(): typeof app {
    return app
}


io.on('connection', function (socket) {
    console.log('A user connected')
    setTimeout(() => { socket.emit('hey', 'data') }, 1000)

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected')
    })
})

attachAPIRoutes()

app.use(express.static('../build'))


http.listen(port, function () {
    console.log(`Serving on http://localhost:${port}`)
})
