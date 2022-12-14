import { AuthUserDBActionProps, BUILD_VER, RunID, ServerActions } from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'

export const startRun: ServerActions['startRun'] = async ({ userId }) => {
    logger.info(`Starting run for: ${userId}`)

    const connection = await getDbClient()
    const runId = await createNewRun({ connection, userId })

    return { runId }
}

const createNewRun = async (props: AuthUserDBActionProps): Promise<RunID> => {
    const { connection, userId } = props
    let sql = sqlTag.typeAlias('id')

    return await connection.oneFirst(sql`
        INSERT INTO kaiju.user_run (
            user_id, run_status, build_version
        )
        VALUES
            (${userId}, 'initializing', ${BUILD_VER})
        RETURNING
            run_id
    `)
}
