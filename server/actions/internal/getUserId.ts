import type { UserID, UserDBActionProps, Username, UserInfo } from 'shared'
import { sql as sqlTag } from '@/db/client'

/** TODO: change name to getUserInfo */
export const getUserId = async (
    props: UserDBActionProps
): Promise<UserInfo> => {
    const { connection, walletAddress } = props
    const userInfo = await getExistingUser({ connection, walletAddress })
    if (userInfo) {
        const { userId, username } = userInfo
        logger.info(`Wallet ${walletAddress} had userId: ${userId}`)
        return { userId, username }
    } else {
        const newUserID = await createNewUser({ connection, walletAddress })
        logger.info(`Wallet ${walletAddress} created new userId: ${newUserID}.`)
        return { userId: newUserID, username: null }
    }
}

const getExistingUser = async (
    props: UserDBActionProps
): Promise<UserInfo | null> => {
    const { connection, walletAddress } = props
    let sql = sqlTag.typeAlias('userInfo')
    const res = await connection.maybeOne(sql`
        SELECT
            user_id, username
        FROM
            kaiju.user_info
        WHERE
            wallet_address = ${walletAddress}
    `)

    if (res) {
        return { userId: res.user_id, username: res.username }
    }
    return null
}

/** NOTE: Might require username on first login in the future */
const createNewUser = async (props: UserDBActionProps): Promise<UserID> => {
    const { connection, walletAddress } = props

    let sql = sqlTag.typeAlias('userId')

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
