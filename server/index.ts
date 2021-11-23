import './config/logger'

import express from 'express'
import session from 'express-session'
import type { Server } from 'http'
import { Server as SocketServer } from 'socket.io'

import { attachAPIRoutes } from './attachActions'
import { setGlobalRandomSeed } from './config/seedrand'
import { addNewUser } from './util'

const config = {
    addNewUserOnStart: false,
}

if (process.env.FIXED_SEED === 'yes') {
    logger.info('NOTE: USING FIXED SEED')
    setGlobalRandomSeed()
}

if (config.addNewUserOnStart) {
    addNewUser({ username: 'defaultUser' })
}

const port = process.env.PORT ?? 3000

const buildInfo = {
    port,
    gitBranch: process.env.SERVER_GIT_BRANCH ?? '',
    gitCommit: process.env.SERVER_GIT_COMMIT ?? '',
    buildTime: process.env.SERVER_BUILD_TIME ?? '',
}
logger.info(`the server started with ${JSON.stringify(buildInfo)}`)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessionMiddleware = session({
    secret: 'random secret',
    saveUninitialized: true,
    resave: true,
})
app.use(sessionMiddleware)


let io: null | SocketServer = null
export function getIo(): SocketServer {
    if (io == null) throw Error('socket.io was not initialized')
    return io
}

export function getApp(): typeof app {
    return app
}


attachAPIRoutes()

app.use('/', express.static(__dirname + '/../build'))
app.use('/setusername', (req, res) => {
    // @ts-expect-error
    req.session.username = req.username
    res.send('success')
})
app.use('/getusername', (req, res) => {
    // @ts-expect-error
    res.send(`your username is ${req.session.username}`)
})

export function mountIo(server: Server, prefix: string): void {
    // app.set('base', prefix)
    io = new SocketServer(server, { path: prefix + '/socket' })

    io.use(function (socket, next) {
        // @ts-expect-error
        sessionMiddleware(socket.request, socket.request.res, next)
    })

    // when a socket.io connect connects, get the session and store the id in it
    io.on('connection', function (socket) {
        // socket.handshake.headers
        logger.info(`socket.io connected: ${socket.id}`)
        // save socket.io socket in the session
        // @ts-expect-error
        logger.info('session at socket.io connection:\n', socket.request.session)
        // @ts-expect-error
        socket.request.session.socketio = socket.id
        // @ts-expect-error
        socket.request.session.save()
    })


    io.on('connection', function (socket) {
        logger.info('A user connected')
        socket.emit('hey', { serverBuildInfo: buildInfo })
        if (config.addNewUserOnStart) {
            // @ ts-expect-error
            // const username = socket.request.session.username as string
            // fullUserCommit(getRootCursor().select('users').select(username))
        }

        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', function () {
            logger.info('A user disconnected')
        })
    })
}

if (process.env.USE_ROUTER !== 'yes') {
    const server = app.listen(port, function () {
        logger.info(`Serving on http://localhost:${port}`)
    })
    mountIo(server, '')
}
