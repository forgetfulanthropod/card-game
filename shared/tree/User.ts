export type UserID = string
export type RunID = number
export type Username = string
export type UserInfo = {
    userId: UserID
    username: Username | null
    userType: UserType
}

export type UserType = 'player' | 'guest' // simplified no web3, support old strings for compat
export type Nonce = string
export type AuthToken = string

// for adapter use
export type UserDBActionProps = {
    connection?: any
    walletAddress?: string
    accountId?: string
}

export type AuthUserDBActionProps = {
    userId: UserID
}
