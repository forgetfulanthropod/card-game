import { keys } from 'lodash'
import {
    AuthUserDBActionProps,
    CharacterId,
    Characters,
    Leaderboard,
    LEADERBOARD_ENTRIES_TO_DISPLAY,
    PlayerCharacterId,
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
            top_self_run AS
            (   SELECT
                    true as is_self,
                    wallet_address,
                    highest_score,
                    start_ts,
                    end_ts,
                    run_id,
                    all_characters
                FROM
                    user_run_leaderboard
                WHERE
                    user_id = ${userId}
            )
        SELECT
            *
        FROM
            (   SELECT
                    false as is_self,
                    wallet_address,
                    highest_score,
                    start_ts,
                    end_ts,
                    run_id,
                    all_characters
                FROM
                    user_run_leaderboard
                ORDER BY
                    highest_score DESC
                LIMIT
                    ${LEADERBOARD_ENTRIES_TO_DISPLAY} ) AS top_100_runs

        UNION

        SELECT
            *
        FROM
            top_self_run
        ORDER BY
            highest_score DESC;
    `)

    const leaderboardWithTeamComp = leaderboard.map(entry => {
        const { all_characters } = entry
        if (!all_characters) {
            return entry
        }

        let teamComp: CharacterId[] = []
        const chars = JSON.parse(all_characters) as Characters
        keys(chars).forEach(key => {
            if (chars[key].isPc) {
                teamComp.push(chars[key].id)
            }
        })
        return { ...entry, teamComp }
    }) as Leaderboard

    return leaderboardWithTeamComp
}
