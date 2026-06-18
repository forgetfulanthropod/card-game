import type {
    UserID,
    UserInfo,
    UserType,
    Nonce,
} from 'shared'
import { getCurrentNonce, getNewNonce } from '.'
import { getUserById, createUser } from '@/storage'

export const getGuestUserInfo = async (props: {
    userId: UserID | null
}): Promise<UserInfo & { nonce: Nonce }> => {
    const { userId: existingUserId } = props
    const userType: UserType = 'player' as UserType

    if (existingUserId) {
        const existing = getUserById(existingUserId)
        if (existing) {
            logger.info(`Existing userId: ${existingUserId}`)
            const nonce = getCurrentNonce(existingUserId) || getNewNonce(existingUserId)
            return { userId: existingUserId, username: existing.username, nonce, userType }
        }
    }
    const userId = createUser()
    logger.info(`Player created new userId: ${userId}.`)
    const nonce = getNewNonce(userId)
    return { userId, username: null, nonce, userType }
}
