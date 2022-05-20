import { clearHappened, getHappened, step } from 'game'
import type { NextAction } from 'shared'
import { sleep } from 'shared/code'
import { commit, emit, getGameStateCursor } from './treeUtils'
import type { CallOptions } from './onCallWrapper'

const sleepLoop = null
type Func<T> = (u: T) => Promise<unknown> | unknown
export async function doActionAndTakeSteps<T>(
    username: string,
    f: Func<T>,
    args: T,
    options: CallOptions
) {
    const game = getGameStateCursor(username)
    // @ts-expect-error
    args.game = game
    let maybeNextAction = f(args)
    logger.info({ maybeNextAction })
    while (isNextAction(maybeNextAction)) {
        logger.info({ maybeNextAction })
        updateClient(username, options)
        await sleep(maybeNextAction.delay)
        maybeNextAction = step(game, maybeNextAction)
    }
    updateClient(username, options)
}
function updateClient(username: string, options: CallOptions) {
    for (const event of getHappened(username)) {
        emit({ username, event })
    }
    clearHappened(username)

    if (options?.disableCommit !== true)
        commit(getGameStateCursor(username), username)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNextAction(x: any): x is NextAction {
    return x?.delay != null
}
