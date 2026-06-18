import type { UserID, ServerActions } from 'shared'
import { activeUserSockets, activeUsers, getSocketId } from '@/IO'

// Simplified: no real JWT/crypto validation after stripping wallets.
// Accept any token or auto pass for the dev json-file flow.
export const verifyAuthToken: ServerActions['verifyAuthToken'] = async ({
    userId,
}) => {
    logger.info(`verifying auth token (simplified) for ${userId}`)
    const socketId = getSocketId(userId)
    if (socketId) {
        const expires = Date.now() + 1000 * 60 * 60 * 4
        const activeUser = activeUsers.get(socketId)
        if (activeUser) activeUsers.set(socketId, { ...activeUser, authExpires: expires })
    }
    return { result: 'success' }
}
