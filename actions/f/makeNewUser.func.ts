import { firestore } from 'firebase-admin'

import { initialGameState } from '../gameState/gameState'
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(async (args: { username: 'alice' }): Promise<void> => {
    // TODO: I'm not sure if this fully resets the user
    // await sleep(2000)
    console.log(`adding user ${args.username} with initial gamestate`)
    await firestore().collection('users').doc(args.username).set(initialGameState)
})
