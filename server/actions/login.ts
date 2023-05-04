import type {
    ServerActions,
    AuthUserDBActionProps,
    UserType,
    WalletAddress,
} from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { getLogger } from 'game'
import { getUserInfo } from './internal'
import { sign } from 'jsonwebtoken'
import { getServerEnv } from 'shared/code'
import { activeUserSockets, activeUsers } from '@/IO'
import { DatabaseConnection } from 'slonik'

export const login: ServerActions['login'] = async ({
    walletAddress,
    socketId,
}) => {
    logger.debug(`Handling login for: ${walletAddress ?? 'Guest User'}`)

    const connection = await getDbClient()

    const existingSocket = await getExistingSocket({ walletAddress, connection })
    if (existingSocket && existingSocket !== socketId) {
        logger.debug(
            `Wallet ${walletAddress} already logged in with socketId: ${existingSocket}`
        )
        throw new Error('User already logged in. No bueno!')
    }

    const { userId, username, nonce, userType } = await getUserInfo({
        connection,
        walletAddress,
    })

    activeUserSockets.set(userId, socketId)

    const activeUser = activeUsers.get(socketId)
    if (activeUser) activeUsers.set(socketId, { ...activeUser, userId })

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

const getExistingSocket = async (props: {
    walletAddress: WalletAddress
    connection: DatabaseConnection
}): Promise<string | undefined> => {
    const { connection, walletAddress } = props
    let sql = sqlTag.typeAlias('userId')

    const userId = await connection.maybeOneFirst(sql`
        SELECT
          user_id
        FROM
          kaiju.user_info
        WHERE
          wallet_address = ${walletAddress}
    `)

    if (userId) {
        return activeUserSockets.get(userId)
    }
}
