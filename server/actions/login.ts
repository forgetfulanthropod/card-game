import type { ServerActions, AuthUserDBActionProps } from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'
import { getLogger } from 'game'
import { getUserInfo } from './internal'
import { sign } from 'jsonwebtoken'
import { getServerEnv } from 'shared/code'

export const login: ServerActions['login'] = async ({
    walletAddress,
}) => {
    logger.info(`Handling login for: ${walletAddress ?? 'Guest User'}`)

    const connection = await getDbClient()
    const { userId, username, nonce } = await getUserInfo({
        connection,
        walletAddress,
    })
    return { userId, username, nonce }
}
