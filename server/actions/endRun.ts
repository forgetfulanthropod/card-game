import {
    ServerActions,
    GameState,
    Scene,
    BattleScene,
} from 'shared'
import { round } from 'lodash'
import { getGamestate } from '@/db'
import { trackMetric } from '@/metrics'
import { endRun as storageEndRun, getCurrentRunId } from '@/storage'

export const endRun: ServerActions['endRun'] = async ({ userId, restart }) => {
    logger.info(`Ending run for: ${userId}`)
    const gameState = await getGamestate(userId)

    if (!gameState) {
        logger.error(`No gamestate found for ${userId}`)
        return { runId: null }
    }

    if (!isBattleScene(gameState.scene)) {
        logger.warn('Not in battle scene')
        return { runId: null }
    }

    const { runId, state } = gameState.scene
    const totalScore = round(gameState.scene.runScore.totalScore, 0)
    const { startTime, endTime } = gameState.scene.runDuration

    let runDuration = 0
    if (endTime) {
        runDuration = getRunDurationInSec(startTime, endTime)
    } else {
        let newEndTime = Date.now()
        runDuration = getRunDurationInSec(startTime, newEndTime)
    }

    logger.info({ userId, runId, totalScore, state, runDuration })

    if (!restart && state !== 'won' && state !== 'lost') {
        logger.warn('Not in battle end state') // only ok when restarting
        return { runId: null }
    }

    // run validation simplified
    if (typeof runId !== 'number') {
        logger.error('Run is not valid')
        return { runId: null }
    }
    storageEndRun(runId, restart ? 'abandoned' : state, totalScore, runDuration, gameState)

    trackMetric('endRun', {
        scene: gameState.scene,
        runDuration,
        restart: restart || false,
    })

    return { runId }
}

const isBattleScene = (scene: Scene): scene is BattleScene => {
    return scene.id === 'battle'
}

const getRunDurationInSec = (startTime: number, endTime: number): number => {
    return ~~((endTime - startTime) / 1000)
}
