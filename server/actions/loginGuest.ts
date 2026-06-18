import type { ServerActions } from 'shared'
import { activeUserSockets, activeUsers } from '@/IO'
import { getGuestUserInfo } from './internal/getGuestUserInfo'
import { touchLogin } from '@/storage'

export const loginGuest: ServerActions['loginGuest'] = async ({
    existingUserId,
    socketId,
}) => {
    logger.info(`Handling login for: ${existingUserId ?? 'New Player'}`)

    const { userId, username, nonce, userType } = await getGuestUserInfo({
        userId: existingUserId,
    })
    activeUserSockets.set(userId, socketId)

    const activeUser = activeUsers.get(socketId)
    if (activeUser) activeUsers.set(socketId, { ...activeUser, userId })

    console.log({ userId, socketId })
    touchLogin(userId)
    return { userId, username, nonce, userType }
}
