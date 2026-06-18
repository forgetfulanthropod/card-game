import { ServerActions } from 'shared'
import { getCurrentRunId } from '@/storage'

export const getCurrentRun: ServerActions['getCurrentRun'] = async ({
    userId,
}) => {
    logger.info(`Getting current run for: ${userId}`)

    const runId = getCurrentRunId(userId)

    logger.info(`${userId} current runId: ${runId}`)
    if (!runId) return null
    return { runId }
}
