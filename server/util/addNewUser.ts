import { getInitialGameState } from '@/gameState/gameState'

import { getRootCursor } from './treeUtils'


export function addNewUser(args: { username: string }): void {
    getRootCursor().select('users').set(args.username, getInitialGameState(args.username))
}
