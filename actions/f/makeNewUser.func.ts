
import { getRootCursor } from '@/util/getters'
import { initialGameState } from '../gameState/gameState'
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(async function makeNewUser(args: { username: 'alice' }): Promise<void> {
    // TODO: I'm not sure if this fully resets the user
    // await sleep(2000)
    console.log(`adding user ${args.username} with initial gamestate`)
    getRootCursor().select('users').select(args.username).set(initialGameState)
})
