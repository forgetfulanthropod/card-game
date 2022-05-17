// import { setUser } from '@/database'

import { getInitialGameState } from 'game'

import { getRootCursor } from './treeUtils'
export function makeNewUser(args: { username: string }): void {
    const gs = getInitialGameState(args.username)
    getRootCursor().select('users').set(args.username, gs)
    // void setUser(args.username, gs)
}
