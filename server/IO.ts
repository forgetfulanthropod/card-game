import { watchFile } from 'fs'
import type { Server } from 'http'
import { has } from 'lodash'
import type { GameState, NetworkEvent } from 'shared'
import { Server as SocketServer } from 'socket.io'
import { maybeMakeUser } from './actions'

const usernameToSocketId: Record<string, string> = {}
const isStagingServer = process.env.DEV_STATIC_ASSETS === 'yes'

export function getSocketId(username: string): string {
    if (has(usernameToSocketId, username)) {
        return usernameToSocketId[username]
    }
    throw Error(`no socket for user ${username}`)
}
let io: null | SocketServer = null

export function emitNewGamestate(username: string, gamestate: GameState) {
    if (io == null) throw Error('io is null')
    const socketId = getSocketId(username)
    io.to(socketId).emit('update', { data: gamestate })
}

export function emitNetworkEvent<_A extends string, _B>(args: {
    username: string
    event: NetworkEvent<_A, _B>
}): void {
    if (io == null) throw Error('io is null')
    const socketId = getSocketId(args.username)
    io.to(socketId).emit(args.event.type, args.event)
}

export function mountIo(
    server: Server,
    buildInfo: Record<string, unknown>,
    prefix: string
): void {
    io = new SocketServer(server, {
        path: prefix + `${isStagingServer ? '/server' : ''}/socket`,
    })
    refreshOnChange(io)
    io.on('connection', socket => {
        // logger.info(`socket connected: ${socket.id}`)
        socket.on(
            'username',
            ({
                username,
                socketId,
            }: {
                username: string
                socketId: string
            }) => {
                // logger.info(['username associated:', { username, socketId }])
                usernameToSocketId[username] = socketId
                void maybeMakeUser({ username })
            }
        )
    })
}
function refreshOnChange(io: SocketServer) {
    watchFile(__dirname + '../../public/dailyship.js', () => {
        io.emit('refresh')
    })
}
