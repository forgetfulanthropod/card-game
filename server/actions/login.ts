import type {
    ServerActions,
    UserType,
} from 'shared'
import { getUserInfo } from './internal'
import { activeUserSockets, activeUsers } from '@/IO'
import { touchLogin } from '@/storage'

export const login: ServerActions['login'] = async (args: any) => {
    const { accountId, walletAddress, socketId } = args || {}
    logger.debug(`Handling login for account: ${accountId}`)

    const existingSocket = activeUserSockets.get(accountId)
    if (existingSocket && existingSocket !== socketId) {
        logger.debug(
            `Account ${accountId} already logged in with socketId: ${existingSocket}`
        )
        // allow for now, no hard throw in simple mode
    }

    const { userId, username, nonce, userType } = await getUserInfo({
        accountId: accountId || walletAddress,
    })

    activeUserSockets.set(userId, socketId)

    const activeUser = activeUsers.get(socketId)
    if (activeUser) activeUsers.set(socketId, { ...activeUser, userId })

    touchLogin(userId)

    return { userId, username, nonce, userType }
}
