import type { ServerActions, AuthUserDBActionProps } from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { getLogger } from 'game'
import { getUserId } from './internal'
import { sign } from 'jsonwebtoken'
import { getServerEnv } from 'shared/code'

export const login: ServerActions['login'] = async ({ walletAddress }) => {
    logger.info(`Handling login for: ${walletAddress}`)

    const connection = await getDbClient()
    const { userId, username } = await getUserId({ connection, walletAddress })
    const accessToken = generateAccessToken(walletAddress)
    await trackNewLogin({ connection, userId })
    return { userId, username, accessToken }
}

const trackNewLogin = async (props: AuthUserDBActionProps): Promise<void> => {
    const { connection, userId } = props
    let sql = sqlTag.typeAlias('void')

    await connection.any(sql`
        UPDATE
          kaiju.user_info
        SET
          last_login_ts = now(),
          last_auth_method = 'connect_wallet' -- TODO: pass in arg when OAuth implemented
        WHERE
          user_id = ${userId}
    `)

    return
}

const generateAccessToken = (walletAddress: string) => {
    return sign({walletAddress}, getServerEnv('JWT_TOKEN_SECRET'), {
        expiresIn: 1800,
    })
}
