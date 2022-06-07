import { clearHappened, getHappened, step } from 'game'
import type { Gamecursor, NextAction } from 'shared'
import { sleep } from 'shared/code'
import { getGameStateCursor, setGamestate } from './db'
import { emitNetworkEvent, emitNewGamestate } from './IO'

type Func<T> = (u: T) => Promise<unknown> | unknown
export async function doActionAndTakeSteps<T>(
    username: string,
    f: Func<T>,
    args: T
) {
    const game = await getGameStateCursor(username)
    // @ts-expect-error
    args.game = game
    let maybeNextAction = f(args)
    logger.info({ maybeNextAction })
    while (isNextAction(maybeNextAction)) {
        logger.info({ maybeNextAction })
        await updateClient(username, game)
        await sleep(maybeNextAction.delay)
        maybeNextAction = step(game, maybeNextAction)
    }
    await updateClient(username, game)
}
async function updateClient(username: string, game: Gamecursor) {
    for (const event of getHappened(username)) {
        emitNetworkEvent({ username, event })
    }
    clearHappened(username)

    emitNewGamestate(username, game.get())
    await setGamestate(username, game.get())
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNextAction(x: any): x is NextAction {
    return x?.delay != null
}
