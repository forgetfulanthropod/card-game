import 'game/config/logger'

// import './database'
import express from 'express'
import session from 'express-session'
import { setGlobalRandomSeed } from 'game/config/seedrand'
import type { Server } from 'http'
import { findKey, has } from 'lodash'
import { Server as SocketServer } from 'socket.io'

import { attachAPIRoutes } from './attachActions'

if (process.env.FIXED_SEED === 'yes') {
    logger.info('NOTE: USING FIXED SEED')
    setGlobalRandomSeed()
}

if (process.env.FORCE_NEW_DB === 'yes') {
    // TODO
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

// eslint-disable-next-line no-console
console.log('DIRNAME:', __dirname)
app.use('/', express.static(__dirname + '/client', { extensions: ['.atlas'] }))

const usernameToSocketId: Record<string, string> = {}
export function setSocketId(username: string, socketId: string): void {
    usernameToSocketId[username] = socketId
}

export function getSocketId(username: string): string {
    if (has(usernameToSocketId, username)) {
        return usernameToSocketId[username]
    }
    throw Error(`no socket for user ${username}`)
}

export function mountIo(server: Server, prefix: string): void {
    // app.set('base', prefix)
    io = new SocketServer(server, { path: prefix + '/socket' })

    io.use(function (socket, next) {
        // @ts-expect-error
        sessionMiddleware(socket.request, socket.request.res, next)
    })

    // when a socket.io connect connects, get the session and store the id in it
    io.on('connection', function packSession(socket) {
        // socket.handshake.headers
        logger.info(`socket.io connected: ${socket.id}`)
        // save socket.io socket in the session
        logger.info(
            'session at socket.io connection:\n',
            // @ts-expect-error
            socket.request.session
        )
        // @ts-expect-error
        socket.request.session.socketio = socket.id

        // @ts-expect-error
        socket.request.session.save()
    })

    io.on('connection', function confirmAndBindDisconnect(socket) {
        logger.info('A user connected')
        socket.emit('receivedConnection', { serverBuildInfo: buildInfo })
        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', function () {
            logger.info('A user disconnected')
            const k = findKey(usernameToSocketId, sid => sid === socket.id)
            if (k !== undefined) {
                delete usernameToSocketId[k]
                logger.info('Removing their record in usernameToSocketId')
            }
        })
    })
}

if (process.env.USE_ROUTER !== 'yes') {
    const server = app.listen(port, function () {
        logger.info(`Serving on http://localhost:${port}`)
    })
    mountIo(server, '')
}
