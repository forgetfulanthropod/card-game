import { spawnSync } from 'child_process'
import express from 'express'
import expsession from 'express-session'
import { Server as SocketServer } from 'socket.io'
import { attachAPIRoutes } from './functions'
const gitBranch = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' })?.output?.[1]?.trim()
console.log('serving from branch', gitBranch)

const port = 3001

const app = express()

const server = app.listen(port, function () {
    console.log(`Serving on http://localhost:${port}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessionMiddleware = expsession({
    secret: 'random secret',
    saveUninitialized: true,
    resave: true
})
app.use(sessionMiddleware)




export function getIo(): typeof io {
    return io
}

export function getApp(): typeof app {
    return app
}



attachAPIRoutes()

app.use(express.static('../build'))


const io = new SocketServer(server)

io.use(function (socket, next) {
    // @ts-ignore
    sessionMiddleware(socket.request, socket.request.res, next)
})

// when a socket.io connect connects, get the session and store the id in it
io.on('connection', function (socket) {
    // socket.handshake.headers
    console.log(`socket.io connected: ${socket.id}`)
    // save socket.io socket in the session
    // @ts-ignore
    console.log("session at socket.io connection:\n", socket.request.session)
    // @ts-ignore
    socket.request.session.socketio = socket.id
    // @ts-ignore
    socket.request.session.save()
})


io.on('connection', function (socket) {
    console.log('A user connected')
    setTimeout(() => { socket.emit('hey', 'data') }, 1000)

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected')
    })
})
