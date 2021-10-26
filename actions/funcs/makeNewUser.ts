
import { initialGameState } from '@/gameState/gameState'
import { getRootCursor, onCallWrapper } from '@/util'

export default onCallWrapper(function makeNewUser(args: { username: 'alice' }): void {
    console.log(`adding user ${args.username} with initial gamestate`)
    getRootCursor().select('users').select(args.username).set(initialGameState)
    getRootCursor().commit()
})
