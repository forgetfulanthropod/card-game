// todo change file name to socketIoServer.ts
import { watchFile } from 'fs'
import type { Server } from 'http'
import {
    ActionName,
    AllActionArgs,
    GameState,
    NetworkEvent,
    UserID,
    getShortWalletAddress,
} from 'shared'
import { Server as SocketServer, Socket } from 'socket.io'
import { api } from './api'
import { SocketID } from 'shared'
import { isAuthenticatedAction } from 'shared'

let socketServer: null | SocketServer = null

export const activeUsers: Map<
    SocketID,
    {
        userId: UserID | null
        authExpires: number | null
    }
> = new Map()

// for faster lookups
export const activeUserSockets: Map<UserID, SocketID> = new Map()

export function mountSocketServer(server: Server, prefix: string): void {
    const isStagingServer = process.env.DEV_STATIC_ASSETS === 'yes' || true // simplified, default serve static in dev mode now

    try {
        socketServer = new SocketServer(server, {
            path: prefix + `${isStagingServer ? '/server' : ''}/socket`,
        })

        refreshOnChange(socketServer)

        socketServer.on('connection', socket => {
            logger.info(`[CONNECTED] Socket ${socket.id}`)
            activeUsers.set(socket.id, { userId: null, authExpires: null })
            logger.info({ activeUsers: activeUsers.size })

            socket.on('api', handleApiCall)
            socket.on('disconnect', () => {
                const userId = activeUsers.get(socket.id)?.userId
                if (userId) activeUserSockets.delete(userId)
                activeUsers.delete(socket.id)

                logger.info(`[DISCONNECTED] Socket ${socket.id} had userId: ${userId}`)
                logger.info({ activeUsers: activeUsers.size })
            })
        })
    } catch (e) {
        console.error(e)
    }
}

function refreshOnChange(socketServer: SocketServer) {
    watchFile(__dirname + '../../public/dailyship.js', () => {
        socketServer.emit('refresh')
    })
}

export function getSocketId(userId: UserID) {
    let socketId = activeUserSockets.get(userId)
    if (!socketId) {
        activeUsers.forEach((value, key) => {
            if (value.userId === userId) {
                socketId = key
                activeUserSockets.set(userId, key)
            }
        })
    }
    return socketId
}

export const userIsAuthenticated = (userId: UserID | null) => {
    if (!userId) return false
    logger.debug(`checking auth for ${getShortWalletAddress(userId)}...`)
    logger.debug({ activeUserSockets })

    const socketId = getSocketId(userId)
    if (!socketId) return new Error('no socket wtf')
    const authExpires = activeUsers.get(socketId)?.authExpires

    logger.debug({ authExpires, dateNow: Date.now() })

    if (!authExpires) return false
    if (authExpires < Date.now()) return false

    return true
}

export function emitUpdatedGameState(userId: UserID, gamestate: GameState) {
    // logger.debug('emit updated game state..')
    const socketId = getSocketId(userId)
    if (socketServer === null) {
        // graceful for isolated/test envs (no full socket server) - do not throw
        logger.debug && logger.debug('emitUpdatedGameState: no socketServer, skipping (test/env mode)')
        return
    }
    if (!socketId) {
        logger.error('no socketId')
        return
    }
    socketServer.to(socketId).emit('update', gamestate)
}

export function emitNetworkEvent<_A extends string, _B>(args: {
    userId: UserID
    event: NetworkEvent<_A, _B>
}): void {
    // logger.debug('emit network event..')
    if (socketServer == null) {
        logger.debug && logger.debug('emitNetworkEvent: no socketServer, skipping (test/env mode)')
        return
    }
    const { userId, event } = args
    const socketId = getSocketId(userId)
    if (!socketId) {
        logger.error('no socketId')
        return
    }
    console.log({socketId})
    socketServer.to(socketId).emit(event.type, event)
}

async function handleApiCall<K extends keyof AllActionArgs>(
    args: AllActionArgs[K] & { method: K; userId: UserID | null },
    callback: any
) {
    const { method, userId } = args
    // logger.debug({ args })
    if (isAuthenticatedAction(method)) {
        const userId = args.userId
        if (!userId) return console.warn('no user id!!!')
        if (!userIsAuthenticated(userId)) {
            logger.warn('[todo] socket is not authenticated')
        }
    }

    try {
        const response = await api(method, args, userId ?? undefined)
        // logger.debug({ response })
        callback(response)
    } catch (e) {
        const err = e as unknown as Error
        logger.error(`error in calling api: ${err.message}. ${err.stack}`)
    }
}
