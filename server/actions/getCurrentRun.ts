import { AuthUserDBActionProps, BUILD_VER, RunID, ServerActions } from 'shared'
import { getDbClient, sql as sqlTag } from '../db/client'
// import { } from 'game'

export const getCurrentRun: ServerActions['getCurrentRun'] = async ({
    userId,
}) => {
    logger.info(`Getting current run for: ${userId}`)

    const connection = await getDbClient()
    if (connection === null) return null
    const runId = await getCurrentRunId({ connection, userId })

    logger.info(`${userId} current runId: ${runId}`)
    return { runId }
}

const getCurrentRunId = async (
    props: AuthUserDBActionProps
): Promise<RunID> => {
    const { connection, userId } = props
    let sql = sqlTag.typeAlias('id')

    return await connection.oneFirst(sql`
        SELECT
            MAX(run_id)
        FROM
            kaiju.user_run
        WHERE
            user_id = ${userId}
    `)
}
