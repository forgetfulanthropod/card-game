import type { Server } from 'http'
import { has } from 'lodash'
import { Server as SocketServer } from 'socket.io'

const usernameToSocketId: Record<string, string> = {}

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
    buildInfo: Record<string, unknown>,
    prefix: string
): void {
    io = new SocketServer(server, { path: prefix + '/socket' })
    io.on('connection', socket => {
        logger.info(`socket connected: ${socket.id}`)
        socket.on(
            'username',
            ({
                username,
                socketId,
            }: {
                username: string
                socketId: string
            }) => {
                logger.info(['username associated:', { username, socketId }])
                usernameToSocketId[username] = socketId
            }
        )
    })
}
