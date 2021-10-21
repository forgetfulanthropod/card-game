import attachAddSelected from './funcs/addSelected'
import attachChangeDungeon from './funcs/changeDungeon'
import attachChangeScene from './funcs/changeScene'
import attachChooseDoor from './funcs/chooseDoor'
import attachDoCharacterAction from './funcs/doCharacterAction'
import attachEcho from './funcs/echo'
import attachExitDungeon from './funcs/exitDungeon'
import attachHello from './funcs/hello'
import attachIncrementTestCounter from './funcs/incrementTestCounter'
import attachMakeNewUser from './funcs/makeNewUser'
import attachSquare from './funcs/square'
import { startGame as attachStartGame } from './gameState/battle/allBattleLogic'
import dispatch from './gameState/battle/dispatch'
import { onCallWrapper } from './util/onCallWrapper'

export function attachAPIRoutes(): void {
    attachAddSelected()
    attachChangeDungeon()
    attachChangeScene()
    attachChooseDoor()
    attachDoCharacterAction()
    attachEcho()
    attachExitDungeon()
    attachHello()
    attachIncrementTestCounter()
    attachMakeNewUser()
    attachSquare()
    attachStartGame()
    onCallWrapper(dispatch)()
}
