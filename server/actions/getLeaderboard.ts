import { keys } from 'lodash'
import {
    CharacterId,
    Characters,
    Leaderboard,
    LEADERBOARD_ENTRIES_TO_DISPLAY,
    MappedLeaderboards,
    ServerActions,
    LeaderboardTimeframe,
    BUILD_VER,
} from 'shared'
import { getAllRunsForLeaderboard, getUsersMap } from '@/storage'

/** In-memory version of leaderboard logic, using the json adapter data
 */
export const getLeaderboard: ServerActions['getLeaderboard'] = async args => {
    const { userId } = args

    logger.info(`Getting leaderboards for ${userId}`)

    const runs = getAllRunsForLeaderboard()
    const users = getUsersMap()

    const now = Date.now()
    const oneDayMs = 24 * 3600 * 1000
    const sevenDaysMs = 7 * oneDayMs

    const filterByTime = (r: any, tf: LeaderboardTimeframe) => {
        if (r.run_score == null) return false
        if (!['won', 'lost', 'abandoned'].includes(r.run_status)) return false
        if (BUILD_VER && r.build_version && r.build_version !== BUILD_VER) return false
        if (tf === 'daily') {
            const end = r.end_ts || r.start_ts
            return (now - end) < oneDayMs
        }
        if (tf === 'weekly') {
            const end = r.end_ts || r.start_ts
            return (now - end) < sevenDaysMs
        }
        return true // allTime
    }

    const makeLb = (timeframe: LeaderboardTimeframe): Leaderboard => {
        let filtered = runs
            .filter(r => filterByTime(r, timeframe))
            .map(r => {
                const u = users[r.user_id]
                let allCharactersStr = null
                try {
                    if (r.game_state && r.game_state.scene && r.game_state.scene.allCharacters) {
                        allCharactersStr = JSON.stringify(r.game_state.scene.allCharacters)
                    }
                } catch {}
                return {
                    leaderboard_rank: 0,
                    is_self: r.user_id === userId,
                    username: u ? u.username : null,
                    max_score: r.run_score,
                    start_ts: r.start_ts,
                    end_ts: r.end_ts || r.start_ts,
                    run_id: r.run_id,
                    all_characters: allCharactersStr,
                }
            })
            .sort((a, b) => (b.max_score || 0) - (a.max_score || 0))

        // assign ranks
        filtered.forEach((e, i) => { e.leaderboard_rank = i + 1 })

        // take top N, plus ensure self is included
        const top = filtered.slice(0, LEADERBOARD_ENTRIES_TO_DISPLAY)
        const selfEntry = filtered.find(e => e.is_self)
        let result = top
        if (selfEntry && !top.some(e => e.run_id === selfEntry.run_id)) {
            result = [...top, selfEntry].sort((a,b) => (b.max_score||0) - (a.max_score||0))
        }
        return result.map(e => {
            let teamComp: CharacterId[] = []
            const ac = e.all_characters
            if (ac) {
                try {
                    const chars = JSON.parse(ac) as Characters
                    keys(chars).forEach((k: any) => {
                        if ((chars as any)[k].isPc) teamComp.push((chars as any)[k].id)
                    })
                } catch {}
            }
            return { ...e, teamComp }
        }) as any as Leaderboard
    }

    const allTime = makeLb('allTime')
    const weekly = makeLb('weekly')
    const daily = makeLb('daily')

    return {
        allTime,
        weekly,
        daily,
    } as MappedLeaderboards
}
