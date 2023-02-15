import {
    ServerActions,
} from 'shared'
import { getDbClient, sql as sqlTag } from '../db/client'

export const getLeaderboardEntryCount: ServerActions['getLeaderboardEntryCount'] = async args => {
    const connection = await getDbClient()
    let sql = sqlTag.typeAlias('number')

    const count = await connection.oneFirst(sql`
        SELECT
            COUNT(DISTINCT(user_id))
        FROM
            user_run
    `)
    logger.info(`Total leaderboard entry count: ${count}`)
    return {count}
}
