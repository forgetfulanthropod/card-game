import { doCharacterAction_ } from '../gameState/battle/allBattleLogic'
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(async ({ uid }: { uid: string }): Promise<void> => { await doCharacterAction_(uid) })
