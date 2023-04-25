import { Nonce, ServerActions, UserID } from 'shared'
import { generateNonce } from 'siwe'

/**
 * // A map to store nonces for each user ID. Will be wiped after each server redeploy!
 */

let inMemoryNonceCache: Map<UserID, Nonce> | null = null

const getNonceCache = () => {
    if (inMemoryNonceCache === null) inMemoryNonceCache = new Map()
    return inMemoryNonceCache
}

export const getCurrentNonce = (userId: UserID) => {
    const nonceCache = getNonceCache()
    const nonce = nonceCache.get(userId) ?? getNewNonce(userId)
    return nonce
}

export const getNewNonce = (userId: UserID) => {
    logger.info(`Getting new nonce for ${userId}`)
    const nonceCache = getNonceCache()
    const nonce = generateNonce()
    nonceCache.set(userId, nonce)
    return nonce
}
