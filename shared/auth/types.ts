import { AuthToken, Nonce, UserID } from 'shared'

export type SocketID = string

export type AuthTokenPayload = {
    userId: UserID
    nonce: Nonce
    iat: number
    exp: number
}

export type AuthRes = Promise<{
    result: 'success' | 'failure'
    authToken?: AuthToken
    error?: string
}>
