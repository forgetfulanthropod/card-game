import { watchFile } from 'fs'
import type { Server } from 'http'
import { has } from 'lodash'
import type { GameState, NetworkEvent, UserID } from 'shared'
import { Server as SocketServer } from 'socket.io'
import { loadGameState } from './actions'
import { api } from './api'
import * as jwt from 'jsonwebtoken'
import { getServerEnv } from 'shared/code'

const userToSocketId: Record<UserID, string> = {}
const isStagingServer = process.env.DEV_STATIC_ASSETS === 'yes'

export function getSocketId(userId: UserID): string {
    if (has(userToSocketId, userId)) {
        return userToSocketId[userId]
    }
    throw Error(`no socket for user ${userId}`)
}
let io: null | SocketServer = null

export function emitUpdatedGameState(userId: UserID, gamestate: GameState) {
    if (io == null) throw Error('io is null')
    const socketId = getSocketId(userId)
    io.to(socketId).emit('update', { data: gamestate })
}

export function emitNetworkEvent<_A extends string, _B>(args: {
    userId: UserID
    event: NetworkEvent<_A, _B>
}): void {
    if (io == null) throw Error('io is null')
    const { userId, event } = args
    const socketId = getSocketId(userId)
    io.to(socketId).emit(event.type, event)
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

        // WIP
        socket.on(
            'authenticate',
            (token: string, callback: (success: boolean) => void) => {
                jwt.verify(
                    token,
                    getServerEnv('JWT_TOKEN_SECRET'),
                    (err, decoded) => {
                        if (err) return callback(false)
                        callback(true)
                    }
                )
            }
        )
        socket.on(
            'userId',
            ({
                userId,
                socketId,
            }: {
                userId: UserID
                socketId: string
            }) => {
                userToSocketId[userId] = socketId
                void loadGameState({ userId })
            }
        )
        socket.on(
            'api',
            async (
                {
                    userId,
                    method,
                    data,
                }: {
                    userId: UserID
                    method: string
                    data: any
                },
                callback
            ) => {
                /*logger.debug(
                    `api called from ${userId} for ${method}: ${JSON.stringify(
                        data
                    )}`
                )*/
                // calling the api incorrectly shouldn't crash the server
                try {
                    const response = await api({ userId, method, data })
                    callback(response)
                } catch (e) {
                    const err = e as unknown as Error
                    logger.error(
                        `error in calling api: ${err.message}. ${err.stack}`
                    )
                }
                //socket.emit('api', response)
            }
        )
    })
}
function refreshOnChange(io: SocketServer) {
    watchFile(__dirname + '../../public/dailyship.js', () => {
        io.emit('refresh')
    })
}
