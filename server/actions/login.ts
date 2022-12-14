import type { ServerActions, AuthUserDBActionProps } from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { getLogger } from '@/../game'
import { getUserId } from './internal'

export const login: ServerActions['login'] = async ({ walletAddress }) => {
    logger.info(`Handling login for: ${walletAddress}`)

    const connection = await getDbClient()
    const userId = await getUserId({ connection, walletAddress })
    await trackNewLogin({ connection, userId })
    return { userId }
}

const trackNewLogin = async (props: AuthUserDBActionProps): Promise<void> => {
    const { connection, userId } = props
    let sql = sqlTag.typeAlias('void')

    await connection.any(sql`
        UPDATE
          kaiju.user_info
        SET
          last_login_ts = now(),
          last_auth_method = 'connect_wallet'
        WHERE
          user_id = ${userId}
    `)

    return
}
