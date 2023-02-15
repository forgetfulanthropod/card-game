import {
    ServerActions,
    MIN_USERNAME_LENGTH,
    MAX_USERNAME_LENGTH,
} from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'
import Filter from 'bad-words'
import { DatabasePool } from 'slonik'
import { lowerCase, toLower } from 'lodash'

export const setUsername: ServerActions['setUsername'] = async ({
    userId,
    username,
}) => {
    const connection = await getDbClient()
    const sql = sqlTag.typeAlias('void')

    username = toLower(username)
    logger.info(`${userId} is trying to set username to: ${username}`)

    if (!usernameIsValid(username)) {
        return { result: 'failure' }
    }

    if (
        usernameIsValid(username) &&
        (await usernameIsAvailable(connection, username))
    ) {
        await connection.query(sql`
            UPDATE
                kaiju.user_info
            SET
                username = ${username}
            WHERE
                user_id = ${userId}
        `)
        return { result: 'success' }
    }

    return { result: 'failure' }
}

const usernameIsValid = (username: string): boolean => {
    const filter = new Filter()

    if (
        username.length < MIN_USERNAME_LENGTH ||
        username.length > MAX_USERNAME_LENGTH
    ) {
        return false
    } else if (filter.isProfane(username)) {
        return false
    }

    return true
}

const usernameIsAvailable = async (
    connection: DatabasePool,
    username: string
): Promise<boolean> => {
    const sql = sqlTag.typeAlias('count')

    const { count } = await connection.one(sql`
        SELECT
          COUNT(*)
        FROM
          user_info
        WHERE
          username = ${username}
    `)

    const isAvailable = count === 0
    logger.info(`username: ${username} is available? ${isAvailable}`)
    return isAvailable
}
