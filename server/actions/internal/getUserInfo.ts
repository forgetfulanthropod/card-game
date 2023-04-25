import type {
    UserID,
    UserDBActionProps,
    UserInfo,
    AuthUserDBActionProps,
    UserType,
    Nonce,
} from 'shared'
import { sql as sqlTag } from '@/db/client'
import { getCurrentNonce, getNewNonce, } from '.'

export const getUserInfo = async (
    props: UserDBActionProps
): Promise<UserInfo & { nonce: Nonce }> => {
    const { connection, walletAddress } = props
    const existingUser = await getExistingUser({ connection, walletAddress })

    if (existingUser) {
        const { userId, username } = existingUser
        logger.info(`Wallet ${walletAddress} had userId: ${userId}`)
        const nonce = getCurrentNonce(userId)
        return { userId, username, nonce }
    } else {
        const userId = await createNewUser({ connection, walletAddress })
        logger.info(
            `Wallet ${
                walletAddress ?? 'Guest Kaiju'
            } created new userId: ${userId}.`
        )
        const userType: UserType = walletAddress ? 'web3' : 'guest'
        await trackNewLogin({ connection, userId, userType })
        const nonce = getNewNonce(userId)
        return { userId, username: null, nonce }
    }
}

const getExistingUser = async (
    props: UserDBActionProps
): Promise<UserInfo | null> => {
    const { connection, walletAddress } = props
    let sql = sqlTag.typeAlias('userInfo')

    if (!walletAddress) return null

    const res = await connection.maybeOne(sql`
        SELECT
            user_id, username
        FROM
            kaiju.user_info
        WHERE
            wallet_address = ${walletAddress}
    `)

    if (res) return { userId: res.user_id, username: res.username }
    else return null
}

const createNewUser = async (props: UserDBActionProps): Promise<UserID> => {
    const { connection, walletAddress } = props

    let sql = sqlTag.typeAlias('userId')

    if (!walletAddress)
        return await connection.oneFirst(sql`
            INSERT INTO kaiju.user_info (
                initial_auth_method
            )
            VALUES
                ('guest')
            RETURNING
                user_id
        `)

    return await connection.oneFirst(sql`
        INSERT INTO kaiju.user_info (
            wallet_address, initial_auth_method
        )
        VALUES
            (${walletAddress}, 'connect_wallet')
        RETURNING
            user_id
    `)
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
