import { clearHappened, getHappened, step, doGameAction } from 'game'
import type { GameActionCall, Gamecursor } from 'shared'
import { sleep } from 'shared/code'
import { setGamestate } from './db'
import { emitNetworkEvent, emitNewGamestate } from './IO'

export async function doActionAndTakeSteps(
    args: GameActionCall & { username: string }
) {
    const { game, username } = args
    doGameAction(args)
    let maybeNextAction = game.get('nextAction')
    while (maybeNextAction != null) {
        updateClient(args.username, game)
        await sleep(maybeNextAction.delay)
        game.set('nextAction', null)
        step(game, maybeNextAction)
        maybeNextAction = game.get('nextAction')
    }
    updateClient(username, game)
}
function updateClient(username: string, game: Gamecursor) {
    for (const event of getHappened(username)) {
        emitNetworkEvent({ username, event })
    }
    clearHappened(username)

    emitNewGamestate(username, game.get())
    setGamestate(username, game.get())
}
