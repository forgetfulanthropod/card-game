import type {
    ServerActions,
} from 'shared'
import { sql as sqlTag } from '@/db/client'
import { generateNonce, SiweMessage } from 'siwe'
import { getCurrentNonce } from './internal'

export const authenticateGuestUser: ServerActions['authenticateGuestUser'] =
    async ({ userId, signature }) => {
        // const siweMessage = new SiweMessage(message)
        // const fields = await siweMessage.validate(signature)

        const storedNonce = getCurrentNonce(userId)
        // if (storedNonce && storedNonce !== fields.nonce) {
        //     return { result: 'failure', error: 'Invalid nonce.' }
        // }

        return { result: 'success', authToken: '12345' }
    }
