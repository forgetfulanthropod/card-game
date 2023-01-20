import {
    AuthUserDBActionProps,
    Leaderboard,
    RunID,
    ServerActions,
} from 'shared'
import { getDbClient, sql as sqlTag } from '../db/client'

export const getLeaderboard: ServerActions['getLeaderboard'] = async (args) => {
    logger.info(`Getting leaderboards...`)
    const connection = await getDbClient()
    let sql = sqlTag.typeAlias('leaderboard')
    const leaderboard: Leaderboard = await connection.many(sql`
        SELECT * FROM user_run_leaderboard order by highest_score desc limit 100
    `)
    return leaderboard
}
