import { getInitialGameState } from '@/gameState/gameState'

import { getRootCursor } from '.'

export function addNewUser(args: { username: 'alice' }): void {
    getRootCursor().select('users').select(args.username).set(getInitialGameState())
}
