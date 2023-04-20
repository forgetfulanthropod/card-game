import { ServerActions } from 'shared'
import { generateNonce } from 'siwe'

export const getNonce: ServerActions['getNonce'] = async ({}) => {
    return { nonce: generateNonce() }
}
