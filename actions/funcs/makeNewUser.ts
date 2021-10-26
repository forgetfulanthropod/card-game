
import { initialGameState } from '@/gameState/gameState'
import { getRootCursor, onCallWrapper } from '@/util'

export default onCallWrapper(function makeNewUser(args: { username: 'alice' }): void {
    // TODO: I'm not sure if this fully resets the user
    // await sleep(2000)
    console.log(`adding user ${args.username} with initial gamestate`)
    getRootCursor().select('users').select(args.username).set(initialGameState)
    getRootCursor().commit()
})
