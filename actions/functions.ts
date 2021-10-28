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
import { dispatch, startGame as attachStartGame, toggleStance as attachToggleStance } from './gameState/battle'
import { onCallWrapper } from './util'

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
    attachToggleStance()
    onCallWrapper(dispatch)()
}
