import type {
    UserID,
    UserDBActionProps,
    UserInfo,
    UserType,
    Nonce,
} from 'shared'
import { getCurrentNonce, getNewNonce } from '.'
import { getUserByAccountId, createUser, getUserById } from '@/storage'

export const getUserInfo = async (
    props: UserDBActionProps
): Promise<UserInfo & { nonce: Nonce }> => {
    const { accountId, walletAddress } = props as any
    const acct = accountId || walletAddress
    let userId: UserID
    let username: string | null = null

    if (acct) {
        const existing = getUserByAccountId(acct)
        if (existing) {
            userId = existing.user_id
            username = existing.username
            logger.info(`Account ${acct} had userId: ${userId}`)
        } else {
            userId = createUser(acct)
            logger.info(`Account ${acct} created userId: ${userId}`)
        }
    } else {
        userId = createUser()
        logger.info(`New player userId: ${userId}`)
    }

    const nonce = getCurrentNonce(userId) || getNewNonce(userId)
    const userType: UserType = 'player' as UserType
    return { userId, username: username || null, nonce, userType }
}

export const createNewUser = (accountId?: string): UserID => {
    return createUser(accountId)
}
