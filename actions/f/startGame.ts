import { startGame_ } from '../gameState/battle/allBattleLogic'
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(async function startGame() { await startGame_() })
