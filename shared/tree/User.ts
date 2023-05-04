import { DatabasePool } from 'slonik'

export type UserID = string
export type RunID = number
export type Username = string
export type UserInfo = {
    userId: UserID
    username: Username | null
    userType: UserType
}

export type Web3UserInfo = UserInfo
export type GuestUserInfo = Omit<UserInfo, 'username'>
export type UserType = 'guest' | 'web3'
export type Nonce = string
export type AuthToken = string

export type UserDBActionProps = {
    connection: DatabasePool
    walletAddress?: string
}

export type AuthUserDBActionProps = {
    connection: DatabasePool
    userId: UserID
}
