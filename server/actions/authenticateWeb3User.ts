import {
    ServerActions,
    AUTH_EXPIRATION_TIME,
} from 'shared'
import { sql as sqlTag } from '@/db/client'
import { generateNonce, SiweMessage } from 'siwe'
import { getCurrentNonce } from './internal'
import * as jwt from 'jsonwebtoken'
import { getServerEnv } from '@/../shared/code'

export const authenticateWeb3User: ServerActions['authenticateWeb3User'] =
    async ({ userId, message, signature }) => {
        logger.info(`Authenticating web3 user... ${userId}`)
        const siweMessage = new SiweMessage(message)
        const fields = await siweMessage.validate(signature)

        const nonce = getCurrentNonce(userId)

        if (!nonce) return { result: 'failure', error: 'No stored nonce.' }

        if (nonce && nonce !== fields.nonce) {
            logger.info({ nonce, fieldsNonce: fields.nonce })
            return { result: 'failure', error: 'Invalid nonce.' }
        }

        const authToken = jwt.sign(
            { userId, nonce },
            getServerEnv('JWT_TOKEN_SECRET'),
            { expiresIn: AUTH_EXPIRATION_TIME }
        )

        logger.info(`Authenticated successfully!`)
        return { result: 'success', authToken }
    }
