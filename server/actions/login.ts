import type { ServerActions } from 'shared'

import { makeNewUser } from './makeNewUser'
import { getGamestate } from '@/db'
import { emitNewGamestate } from '@/IO'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { DatabasePool } from 'slonik'

export const login: ServerActions['login'] = async ({ walletAddress }) => {
    console.log('Handling login server action... args: ', walletAddress)
    try {
        const db = await getDbClient()

        const existingUserId = await getExistingUser(db, walletAddress)
        if (existingUserId) {
            console.log('existing user', existingUserId)
            return {userId: existingUserId}
        } else {
            const newUserID = await createNewUser(db, walletAddress)
            console.log('created new user', newUserID)
            return {userId: newUserID}
        }
    } catch (e) {
        console.error(e)
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
