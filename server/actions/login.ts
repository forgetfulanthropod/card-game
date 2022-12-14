import type { ServerActions } from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { DatabasePool } from 'slonik'
import { getLogger } from '@/../game'

export const login: ServerActions['login'] = async ({ walletAddress }) => {
    const logger = getLogger()
    
    try {
        logger.info(`Handling login for: ${walletAddress}`)
        const db = await getDbClient()
        const existingUserId = await getExistingUser(db, walletAddress)

        if (existingUserId) {
            logger.info(
                `Wallet ${walletAddress} has an existing userId: ${existingUserId}`
            )
            return { userId: existingUserId }
        }

        const newUserID = await createNewUser(db, walletAddress)
        logger.info(`Wallet ${walletAddress} created new userId: ${newUserID}.`)

        return { userId: newUserID }
    } catch (e) {
        logger.error(e)
        return null
    }
}

const getExistingUser = async (
    connection: DatabasePool,
    walletAddress: string
): Promise<string | null> => {
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

const createNewUser = async (
    connection: DatabasePool,
    walletAddress: string
): Promise<string> => {
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
