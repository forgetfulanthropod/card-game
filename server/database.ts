import type { Gamestate } from '@shared'
import { AceBase } from 'acebase'

const db = new AceBase('kaiju_db', { logLevel: 'warn' })

// @ts-ignore
const getRef = (username: string) => db.ref(`users/${username}`)

export async function deleteUser(username: string): Promise<void> {
    await getRef(username).remove()
}

export async function setUser(
    username: string,
    data: Gamestate
): Promise<void> {
    await getRef(username).set(data)
}

export async function readUser(username: string): Promise<Gamestate> {
    return (await getRef(username).get()).val()
}

export async function hasUser(username: string): Promise<boolean> {
    return (await getRef(username).get()).exists()
}

export async function getAllUsers(): Promise<Record<string, Gamestate>> {
    // @ts-ignore
    return (await db.ref('users').get()).val()
}
