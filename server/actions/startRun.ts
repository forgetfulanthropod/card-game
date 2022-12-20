import { AuthUserDBActionProps, BUILD_VER, RunID, ServerActions } from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { getGamestate } from '@/db'

export const startRun: ServerActions['startRun'] = async ({ userId }) => {
    logger.info(`Starting run for: ${userId}`)

    const connection = await getDbClient()
    await cleanUpPreviousRuns({ connection, userId })
    const runId = await createNewRun({ connection, userId })

    logger.info(`${userId} started runId: ${runId}`)
    return { runId }
}

const createNewRun = async (props: AuthUserDBActionProps): Promise<RunID> => {
    const { connection, userId } = props
    let sql = sqlTag.typeAlias('id')

    const gameState = await getGamestate(userId)
    const runStatus = gameState ? 'in_progress' : 'initializing'

    return await connection.oneFirst(sql`
        INSERT INTO kaiju.user_run (
            user_id, run_status, build_version, game_state
        )
        VALUES
            (${userId}, ${runStatus}, ${BUILD_VER}, ${JSON.stringify(gameState)})
        RETURNING
            run_id
    `)
}

const cleanUpPreviousRuns = async (
    props: AuthUserDBActionProps
): Promise<void> => {
    const { connection, userId } = props
    let sql = sqlTag.typeAlias('id')

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
}
