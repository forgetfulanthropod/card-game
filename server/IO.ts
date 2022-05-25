import type { Server } from 'http'
import type { RequestHandler } from 'express'
import { findKey, has } from 'lodash'
import { Server as SocketServer } from 'socket.io'

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
let io: null | SocketServer = null
export function getIo(): SocketServer {
    if (io == null) throw Error('socket.io was not initialized')
    return io
}

export function mountIo(
    server: Server,
    sessionMiddleware: RequestHandler,
    buildInfo: Record<string, unknown>,
    prefix: string
): void {
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
