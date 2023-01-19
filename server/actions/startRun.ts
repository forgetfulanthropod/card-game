import { AuthUserDBActionProps, BUILD_VER, RunID, ServerActions } from 'shared'
import { startRunMetric } from '@/metrics'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { getGamestate } from '@/db'

export const startRun: ServerActions['startRun'] = async ({ userId }) => {
    logger.info(`Starting run for: ${userId}`)

    const connection = await getDbClient()
    await cleanUpPreviousRuns({ connection, userId })
    const runId = await createNewRun({ connection, userId })

    startRunMetric(runId, userId)
    logger.info(`${userId} started runId: ${runId}`)
    return { runId }
}

const createNewRun = async (props: AuthUserDBActionProps): Promise<RunID> => {
    const { connection, userId } = props
    let sql = sqlTag.typeAlias('id')

    const gameState = await getGamestate(userId)
    const runStatus = gameState ? 'in_progress' : 'initializing'

    try {
        const runId = await connection.oneFirst(sql`
			INSERT INTO kaiju.user_run (
				user_id, run_status, build_version, game_state
			)
			VALUES
				(${userId}, ${runStatus}, ${BUILD_VER}, ${JSON.stringify(gameState)})
			RETURNING
				run_id
		`)
        return runId
    } catch (e) {
        const err = e as Error
        if (e instanceof TypeError) {
            logger.error(
                `error creating new run; no connection to db? : ${err.message}`
            )
        } else {
            logger.error(`error creating new run: ${err.message} ${err.stack}`)
        }
        return -1
    }
}

const cleanUpPreviousRuns = async (
    props: AuthUserDBActionProps
): Promise<void> => {
    const { connection, userId } = props
    let sql = sqlTag.typeAlias('id')

    try {
        await connection.query(sql`
			UPDATE
				kaiju.user_run
			SET
				run_status = 'abandoned'
			WHERE
				user_id = ${userId}
			AND
				(
					run_status = 'initializing'
				OR  run_status = 'in_progress');
		`)
    } catch (e) {
        const err = e as Error
        if (e instanceof TypeError) {
            logger.error(
                `error cleaning previous runs; no connection to db? : ${err.message}`
            )
            return
        }
        logger.error(
            `error cleaning previous runs: ${err.message} ${err.stack}`
        )
    }
}
