import {
    AuthUserDBActionProps,
    Leaderboard,
    RunID,
    ServerActions,
} from 'shared'
import { getDbClient, sql as sqlTag } from '../db/client'

/** Currently fetches either 100 or 101 rows depending on user being in top 100 */
export const getLeaderboard: ServerActions['getLeaderboard'] = async args => {
    const connection = await getDbClient()
    const { userId } = args
    let sql = sqlTag.typeAlias('leaderboard')

    logger.info(`Getting leaderboards for ${userId}`)
    const leaderboard: Leaderboard = await connection.many(sql`
        WITH
            tmp AS
            (   SELECT
                    *
                FROM
                    user_run_leaderboard
                ORDER BY
                    highest_score DESC
                LIMIT
                    100
            )
        SELECT
            *
        FROM
            tmp
        NATURAL FULL JOIN
            (   SELECT
                    *
                FROM
                    user_run_leaderboard
                WHERE
                    user_id = ${userId}) AS u;
    `)
    return leaderboard
}
