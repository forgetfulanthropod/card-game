import { clearHappened, getHappened, step, doGameAction } from 'game'
import type { GameActionCall, Gamecursor, UserID } from 'shared'
import { sleep } from 'shared/code'
import { setGamestate } from './db'
import { emitNetworkEvent, emitUpdatedGameState } from './IO'
import { SBaobab } from 'sbaobab'
import { getGamestate } from './db'

export type ApiCall = GameActionCall & { userId: UserID }
export const processingQueue: Record<string, ApiCall[]> = {}
export const isProcessing = new Set<string>()

export const processActionQueue = async (userId: UserID) => {
    let actionQueue = processingQueue[userId]
    if (!actionQueue || isProcessing.has(userId)) return
    isProcessing.add(userId)
    let action
    while ((action = processingQueue[userId].shift())) {
        try {
            const gamestate = await getGamestate(userId)
            if (gamestate == null) throw Error('no gamestate for this user')
            const game = new SBaobab(gamestate).select()
            await doActionAndTakeSteps({ ...action, game })
        } catch (e) {
            const err = e as unknown as Error
            logger.error(
                `error doing game action: ${err.message}\n${err.stack}`
            )
        }
    }
    isProcessing.delete(userId)
    // TODO: discuss: should delete empty queues?
    if (!processingQueue[userId].length) delete processingQueue[userId]
    return
}

export async function doActionAndTakeSteps(
    args: ApiCall
) {
    const { game, userId } = args
    doGameAction(args)
    let maybeNextAction = game.get('nextAction')
    while (maybeNextAction != null) {
        updateClient(args.userId, game)
        await sleep(maybeNextAction.delay)
        game.set('nextAction', null)
        step(game, maybeNextAction)
        maybeNextAction = game.get('nextAction')
    }
    updateClient(userId, game)
}
function updateClient(userId: UserID, game: Gamecursor) {
    for (const event of getHappened(userId)) {
        emitNetworkEvent({ userId, event })
    }
    clearHappened(userId)

    emitUpdatedGameState(userId, game.get())
    setGamestate(userId, game.get())
}
