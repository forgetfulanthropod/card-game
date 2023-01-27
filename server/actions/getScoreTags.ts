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
} from 'shared'
import { getDbClient, sql as sqlTag } from '../db/client'

export const getScoreTags: ServerActions['getScoreTags'] = async args => {
    const connection = await getDbClient()
    const { userId, runId } = args
    let sql = sqlTag.typeAlias('leaderboard')

    logger.info(`Checking score tags for runId: ${runId}`)

    return {
        isNewHighScore: true,
        topPercentile: 0.15
    }
}
