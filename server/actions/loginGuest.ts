import type { ServerActions, AuthUserDBActionProps, UserType } from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { getLogger } from 'game'
import { getUserInfo } from './internal'
import { sign } from 'jsonwebtoken'
import { getServerEnv } from 'shared/code'
import { activeUserSockets, activeUsers } from '@/IO'
import { getGuestUserInfo } from './internal/getGuestUserInfo'

export const loginGuest: ServerActions['loginGuest'] = async ({
    existingUserId,
    socketId,
}) => {
    logger.info(`Handling login for: ${existingUserId ?? 'New Guest User'}`)

    const connection = await getDbClient()
    const { userId, username, nonce, userType } = await getGuestUserInfo({
        connection,
        userId: existingUserId,
    })
    activeUserSockets.set(userId, socketId)

    const activeUser = activeUsers.get(socketId)
    if (activeUser) activeUsers.set(socketId, { ...activeUser, userId })

    console.log({ userId, socketId })
    await trackNewLogin({ connection, userId, userType })
    return { userId, username, nonce, userType }
}

const trackNewLogin = async (
    props: AuthUserDBActionProps & { userType: UserType }
): Promise<void> => {
    const { connection, userId, userType } = props
    let sql = sqlTag.typeAlias('void')
    const authMethod = userType === 'web3' ? 'connect_wallet' : 'guest'

    await connection.any(sql`
        UPDATE
          kaiju.user_info
        SET
          last_login_ts = now(),
          last_auth_method = ${authMethod}
        WHERE
          user_id = ${userId}
    `)

    return
}
