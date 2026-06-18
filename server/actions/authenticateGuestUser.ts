import type { ServerActions } from 'shared'
import { getCurrentNonce } from './internal'

export const authenticateGuestUser: ServerActions['authenticateGuestUser'] =
    async ({ userId }) => {
        const storedNonce = getCurrentNonce(userId)
        // simple pass for guest path now
        return { result: 'success', authToken: 'guest-' + userId }
    }
