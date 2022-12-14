import type {
    UserID,
    UserDBActionProps,
} from 'shared'
import { sql as sqlTag } from '@/db/client'

export const getUserId = async (props: UserDBActionProps): Promise<UserID> => {
    const { connection, walletAddress } = props
    const existingUserId = await getExistingUser({ connection, walletAddress })
    if (existingUserId) {
        logger.info(`Wallet ${walletAddress} had userId: ${existingUserId}`)
        return existingUserId
    } else {
        const newUserID = await createNewUser({ connection, walletAddress })
        logger.info(`Wallet ${walletAddress} created new userId: ${newUserID}.`)
        return newUserID
    }
}

const getExistingUser = async (
    props: UserDBActionProps
): Promise<UserID | null> => {
    const { connection, walletAddress } = props

    let sql = sqlTag.typeAlias('userId')

    return await connection.maybeOneFirst(sql`
        SELECT
            user_id
        FROM
            kaiju.user_info
        WHERE
            wallet_address = ${walletAddress}
    `)
}

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
