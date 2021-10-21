import { initialEntryState } from '../gameState/entry/state'
import { getGameStateCursor } from '../util/getters'
import { onCallWrapper } from '../util/onCallWrapper'
export default onCallWrapper(async function exitDungeon(_args: { [x: string]: never }): Promise<void> {
    const gameState = await getGameStateCursor('alice')
    if (gameState.select('scene').getK('name') !== 'battle') {
        throw Error('exitDungeon callede when not in a battle scene')
    }
    gameState.select('scene').set(initialEntryState)
    await gameState.flush()
})
