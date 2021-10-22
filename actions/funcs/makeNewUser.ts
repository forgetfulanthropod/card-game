
import { initialGameState } from '../gameState/gameState'
import { getRootCursor } from '../util/treeAccessors'
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(function makeNewUser(args: { username: 'alice' }): void {
    // TODO: I'm not sure if this fully resets the user
    // await sleep(2000)
    console.log(`adding user ${args.username} with initial gamestate`)
    getRootCursor().select('users').select(args.username).set(initialGameState)
    getRootCursor().flush()
})
