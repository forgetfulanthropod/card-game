import {
    ServerActions,
} from 'shared'
import { getAllRunsForLeaderboard } from '@/storage'

export const getLeaderboardEntryCount: ServerActions['getLeaderboardEntryCount'] = async args => {
    const runs = getAllRunsForLeaderboard()
    const unique = new Set(runs.map(r => r.user_id))
    const count = unique.size
    logger.info(`Total leaderboard entry count: ${count}`)
    return {count}
}
