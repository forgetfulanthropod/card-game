import { getInitialGameState } from '@/gameState/gameState'

import { getRootCursor } from './treeUtils'


export function addNewUser(args: { username: string }): void {
    getRootCursor().select('users').select(args.username).set(getInitialGameState(args.username))
}
