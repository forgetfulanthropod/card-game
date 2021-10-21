import attachAddSelected from './f/addSelected.func'
import attachChangeDungeon from './f/changeDungeon.func'
import attachChangeScene from './f/changeScene.func'
import attachChooseDoor from './f/chooseDoor.func'
import attachDoCharacterAction from './f/doCharacterAction.func'
import attachEcho from './f/echo.func'
import attachExitDungeon from './f/exitDungeon.func'
import attachHello from './f/hello.func'
import attachIncrementTestCounter from './f/incrementTestCounter.func'
import attachMakeNewUser from './f/makeNewUser.func'
import attachSquare from './f/square'
import attachStartGame from './f/startGame'

export function doIt(): void {
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
}
