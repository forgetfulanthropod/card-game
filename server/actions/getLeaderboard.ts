import {
    AuthUserDBActionProps,
    Leaderboard,
    LEADERBOARD_ENTRIES_TO_DISPLAY,
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

    //TODO add rank to sql return
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
                    ${LEADERBOARD_ENTRIES_TO_DISPLAY}
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
