
import { initialGameState } from '@/gameState/gameState'
import { getRootCursor } from '@/util'

export default function makeNewUser(args: { username: 'alice' }): void {
    logger.info(`adding user ${args.username} with initial gamestate`)
    getRootCursor().select('users').select(args.username).set(initialGameState)
    getRootCursor().commit()
}
