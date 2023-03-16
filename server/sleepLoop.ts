import { clearHappened, getHappened, step, doGameAction } from 'game'
import type { GameActionCall, Gamecursor } from 'shared'
import { sleep } from 'shared/code'
import { setGamestate } from './db'
import { emitNetworkEvent, emitNewGamestate } from './IO'

export type ApiCall = GameActionCall & { username: string }
export const processingQueue: Record<string, ApiCall[]> = {}
export const isProcessing = new Set<string>()

export const processActionQueue = async (game: Gamecursor) => {
    const username = game.get('username')
    let actionQueue = processingQueue[username]
    if (!actionQueue || isProcessing.has(username)) return
    isProcessing.add(username)
    let action
    while ((action = processingQueue[username].shift())) {
        try {
            await doActionAndTakeSteps({ ...action, game })
        } catch (e) {
            const err = e as unknown as Error
            logger.error(
                `error doing game action: ${err.message}\n${err.stack}`
            )
        }
    }
    isProcessing.delete(username)
    return
}

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
