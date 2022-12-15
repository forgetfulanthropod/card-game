import { DatabasePool } from 'slonik'

export type UserID = string
export type RunID = number

export type UserDBActionProps = {
    connection: DatabasePool,
    walletAddress: string
}

export type AuthUserDBActionProps = {
    connection: DatabasePool
    userId: UserID
}
