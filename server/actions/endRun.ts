import {
    AuthUserDBActionProps,
    ServerActions,
    Gamestate,
    Scene,
    BattleScene,
} from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { round } from 'lodash'
import { getGamestate } from '@/db'
import { trackMetric } from '@/metrics'

export const endRun: ServerActions['endRun'] = async ({ userId, restart }) => {
    logger.info(`Ending run for: ${userId}`)
    const connection = await getDbClient()
    const gameState = await getGamestate(userId)
    let sql = sqlTag.typeAlias('void')

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

    const runIsValid = validateRun({ connection, userId, gameState })
    if (!runIsValid) {
        logger.error('Run is not valid')
        return { runId: null }
    }
    await connection.query(sql`
        UPDATE
            kaiju.user_run
        SET
            run_status = ${restart ? 'abandoned' : state},
            end_ts = now(),
            run_duration_in_sec = ${runDuration},
            run_score = ${totalScore},
            game_state = ${JSON.stringify(gameState)}
        WHERE
           run_id = ${runId};
    `)

    trackMetric('endRun', {
        scene: gameState.scene,
        runDuration,
        restart: restart || false,
    })

    return { runId }
}

const validateRun = async (
    props: AuthUserDBActionProps & { gameState: Gamestate }
): Promise<Boolean> => {
    // TODO
    return true
}

const isBattleScene = (scene: Scene): scene is BattleScene => {
    return scene.id === 'battle'
}

const getRunDurationInSec = (startTime: number, endTime: number): number => {
    return ~~((endTime - startTime) / 1000)
}
