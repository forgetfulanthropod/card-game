import type { UserID, Nonce, ServerActions } from 'shared'
import { getCurrentNonce } from './internal'
import * as jwt from 'jsonwebtoken'
import { getServerEnv } from '@/../shared/code'
import { isObject } from 'lodash'
import { AuthTokenPayload } from 'shared'
import { activeUserSockets, activeUsers, getSocketId } from '@/IO'

export const verifyAuthToken: ServerActions['verifyAuthToken'] = async ({
    userId,
    authToken,
}) => {
    logger.info(`verifying auth token for ${userId}`)
    try {
        const payload = jwt.verify(
            authToken,
            getServerEnv('JWT_TOKEN_SECRET')
        ) as AuthTokenPayload

        if (!isObject(payload))
            return { result: 'failure', error: 'Decoding JWT went wrong...' }

        const [issuedAt, authExpires] = [payload.iat * 1000, payload.exp * 1000]
        const payloadUserId = payload.userId as UserID
        const nonce = payload.nonce as Nonce

        const storedNonce = getCurrentNonce(userId)
        if (!storedNonce)
            return { result: 'failure', error: 'No stored nonce.' }
        if (payloadUserId !== userId)
            return { result: 'failure', error: 'User ID mismatch.' }
        if (nonce !== storedNonce)
            return { result: 'failure', error: 'Nonce mismatch.' }
        if (issuedAt > Date.now())
            return { result: 'failure', error: 'Token issued in the future.' }
        if (authExpires < Date.now())
            return { result: 'failure', error: 'Token expired.' }

        logger.info(`Auth token verified successfully!`)
        markUserAsAuthenticated(userId, authExpires)
        return { result: 'success' }
    } catch (e: unknown) {
        let error = e as Error
        console.error(error)
        return { result: 'failure', error: error?.message }
    }
}

const markUserAsAuthenticated = (userId: UserID, authExpires: number) => {
    const socketId = getSocketId(userId)
    if (!socketId) return logger.error(`No socket ID for ${userId}`)
    const activeUser = activeUsers.get(socketId)
    if (activeUser) activeUsers.set(socketId, { ...activeUser, authExpires })
}
