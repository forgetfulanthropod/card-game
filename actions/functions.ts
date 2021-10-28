// import attachAddSelected from './funcs/addSelected'
// import attachChangeDungeon from './funcs/changeDungeon'
// import attachChangeScene from './funcs/changeScene'
// import attachChooseDoor from './funcs/chooseDoor'
// import attachDoCharacterAction from './funcs/doCharacterAction'
// import attachEcho from './funcs/echo'
// import attachExitDungeon from './funcs/exitDungeon'
// import attachHello from './funcs/hello'
// import attachIncrementTestCounter from './funcs/incrementTestCounter'
// import attachMakeNewUser from './funcs/makeNewUser'
// import attachSquare from './funcs/square'
// import attachStartGame from './funcs/startGame'

import * as allFunctions from './funcs'
import { dispatch } from './gameState/battle'
import { onCallWrapper, vals } from './util'

export function attachAPIRoutes(): void {
    vals(allFunctions).forEach(
        // f => onCallWrapper(f)()
        f => f()
    )

    onCallWrapper(dispatch)()
}
