//@ts-ignore
import _ from 'ts-node/register' // debugging
import express from 'express'
// import path from 'path'
import { Server as SocketServer } from 'socket.io'
import { Server as HttpServer } from 'http'
const app = express()
app.use(express.static('../build'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const http = new HttpServer(app)
const io = new SocketServer(http)
// @ts-ignore

export function getIo() {
    return io
}

export function getApp() {
    return app
}

const port = 3002

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html>
       <head>
          <title>Hello world</title>
       </head>
       <script src = "/socket.io/socket.io.js"></script>

       <script>
          const socket = io();
          socket.on('hey', (args) => console.log('received hey with', args))
       </script>
       <body>Hello</body>
    </html>
    `)
})
// app.get('/hi', (req, res) => {
//     res.send('hi there')
// })
//Whenever someone connects this gets executed

io.on('connection', function (socket) {
    console.log('A user connected')
    setTimeout(() => { socket.emit('hey', 'data') }, 1000)

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected')
    })
})

// @ts-ignore
global.io = io

import { doIt } from './functions'
doIt()
http.listen(port, function () {
    console.log(`listening on port ${port}`)
})
