import { Nonce, UserID } from 'shared'

/**
 * // A map to store nonces for each user ID. Will be wiped after each server redeploy!
 * simple non-crypto nonce for auth flow (still used by token verify)
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
    // simple nonce, no real crypto
    const nonce = 'n-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    nonceCache.set(userId, nonce)
    return nonce
}
