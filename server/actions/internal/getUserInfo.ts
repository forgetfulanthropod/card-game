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
        const userType: UserType = walletAddress ? 'web3' : 'guest'
        return { userId, username, nonce, userType }
    } else {
        const userId = await createNewUser({ connection, walletAddress })
        logger.info(
            `Wallet ${
                walletAddress ?? 'Guest Kaiju'
            } created new userId: ${userId}.`
        )
        const userType: UserType = walletAddress ? 'web3' : 'guest'
        const nonce = getNewNonce(userId)
        return { userId, username: null, nonce, userType }
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
            user_id, username, wallet_address
        FROM
            kaiju.user_info
        WHERE
            wallet_address = ${walletAddress}
    `)

    if (res) return { userId: res.user_id, username: res.username, userType: walletAddress ? 'web3' : 'guest' }
    else return null
}

export const createNewUser = async (props: UserDBActionProps): Promise<UserID> => {
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
