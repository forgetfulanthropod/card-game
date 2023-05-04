import type {
    UserID,
    UserDBActionProps,
    UserInfo,
    AuthUserDBActionProps,
    UserType,
    Nonce,
} from 'shared'
import { sql as sqlTag } from '@/db/client'
import { createNewUser, getCurrentNonce, getNewNonce } from '.'
import { DatabasePool } from 'slonik'

export const getGuestUserInfo = async (props: {
    connection: DatabasePool
    userId: UserID | null
}): Promise<UserInfo & { nonce: Nonce }> => {
    const { connection, userId } = props
    const existingUser = await getExistingUser({ connection, userId })
    const userType: UserType = 'guest'

    if (existingUser) {
        const { userId, username } = existingUser
        logger.info(`Existing userId: ${userId}`)
        const nonce = getCurrentNonce(userId)
        return { userId, username, nonce, userType }
    } else {
        const userId = await createNewUser({ connection })
        logger.info(`Guest User created new userId: ${userId}.`)
        const nonce = getNewNonce(userId)
        return { userId, username: null, nonce, userType }
    }
}

const getExistingUser = async (props: {
    connection: DatabasePool
    userId: UserID | null
}): Promise<UserInfo | null> => {
    const { connection, userId } = props
    let sql = sqlTag.typeAlias('userInfo')

    if (!userId) return null

    const res = await connection.maybeOne(sql`
        SELECT
            user_id, username, wallet_address
        FROM
            kaiju.user_info
        WHERE
            user_id = ${userId}
    `)

    if (res)
        return {
            userId: res.user_id,
            username: res.username,
            userType: 'guest',
        }
    else return null
}
