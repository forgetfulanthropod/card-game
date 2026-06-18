import { ServerActions } from 'shared'
import { trackMetric } from '@/metrics'
import { getGamestate } from '@/db'
import { createRun } from '@/storage'

export const startRun: ServerActions['startRun'] = async ({ userId }) => {
    logger.info(`Starting run for: ${userId}`)

    const gameState = await getGamestate(userId)
    const runId = createRun(userId, gameState)

    trackMetric('startRun', { runId, userId })
    logger.info(`Started run for ${userId}: ${runId}`)
    return { runId }
}
