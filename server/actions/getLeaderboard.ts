import { keys } from 'lodash'
import {
    AuthUserDBActionProps,
    CharacterId,
    Characters,
    Leaderboard,
    LEADERBOARD_ENTRIES_TO_DISPLAY,
    MappedLeaderboards,
    PlayerCharacterId,
    RunID,
    ServerActions,
    LeaderboardTimeframe,
    BUILD_VER,
} from 'shared'
import { getDbClient, sql as sqlTag } from '../db/client'

/** Currently fetches either 100 or 101 rows depending on user being in top 100
 */
export const getLeaderboard: ServerActions['getLeaderboard'] = async args => {
    const connection = await getDbClient()
    const { userId } = args
    let sql = sqlTag.typeAlias('leaderboard')

    logger.info(`Getting leaderboards for ${userId}`)

    const getLeaderboardByTimeframe = async (
        timeframe: LeaderboardTimeframe
    ): Promise<Leaderboard> => {
        const whereFragment =
            timeframe === 'daily'
                ? sqlTag.fragment`WHERE date(end_ts) = date(now()) AND run_status in ('won', 'lost', 'abandoned') AND build_version = ${BUILD_VER}`
                : timeframe === 'weekly'
                ? sqlTag.fragment`WHERE
                end_ts > now() - interval '7 days' AND run_status in ('won', 'lost', 'abandoned') AND build_version = ${BUILD_VER}`
                : sqlTag.fragment`WHERE run_status in ('won', 'lost', 'abandoned')`

        return await connection.any(sql`
            WITH
                user_run_leaderboards AS
                (   SELECT
                        ROW_NUMBER() over(ORDER BY u.run_score DESC) AS leaderboard_rank,
                        CASE
                            WHEN u.user_id = ${userId}
                            THEN true
                            ELSE false
                        END AS is_self,
                        i.wallet_address,
                        i.username,
                        u.run_score as max_score,
                        u.start_ts,
                        u.end_ts,
                        u.run_id,
                        u.game_state -> 'scene' ->> 'allCharacters' AS all_characters
                    FROM
                        user_run u
                    JOIN
                        user_info i
                    ON
                        u.user_id = i.user_id
                    ${whereFragment}
                    AND run_score IS NOT NULL
                    GROUP BY
                        u.user_id,
                        u.end_ts,
                        u.run_id,
                        i.wallet_address,
                        i.username
                )
            SELECT
                *
            FROM
                (   SELECT
                        *
                    FROM
                        user_run_leaderboards
                    LIMIT
                        ${LEADERBOARD_ENTRIES_TO_DISPLAY}) AS all_leaderboard

            UNION
                (   SELECT
                        *
                    FROM
                        user_run_leaderboards
                    WHERE
                        is_self = true )
            ORDER BY
                leaderboard_rank;
        `)
    }

    const allTimeLeaderboard = getLeaderboardByTimeframe('allTime')
    const weeklyLeaderboard = getLeaderboardByTimeframe('weekly')
    const dailyLeaderboard = getLeaderboardByTimeframe('daily')

    const allLeaderboards = await Promise.all([
        allTimeLeaderboard,
        weeklyLeaderboard,
        dailyLeaderboard,
    ]) // idx is important
    const allLeaderboardsWithTeam = allLeaderboards.map(leaderboard => {
        return leaderboard.map(entry => {
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
    })

    return {
        allTime: allLeaderboardsWithTeam[0],
        weekly: allLeaderboardsWithTeam[1],
        daily: allLeaderboardsWithTeam[2],
    } as MappedLeaderboards
}
