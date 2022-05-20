import { clearHappened, getHappened, step } from 'game'
import type { Gamecursor, NextAction } from 'shared'
import { sleep } from 'shared/code'

import { getApp } from './index'
import { commit, emit, getGameStateCursor } from './treeUtils'

const config = { log: true }
// const log = (...args: unknown[]) => true && logger.info(...args)

function makeRandId() {
    return srandom().toString().slice(2, 6)
}

type CallOptions = {
    disableCommit?: boolean
    wholeRequest?: boolean
}

export function onCallWrapper<Args, ReturnType>(
    f: ((u: Args) => ReturnType) | ((u: Args) => Promise<ReturnType>),
    options?: CallOptions
): void {
    logger.info(`attaching route  ${f.name}`)
    getApp().post('/' + f.name, async (request, response) => {
        const randId = makeRandId()
        try {
            let result: ReturnType | null = null
            // @ts-expect-error
            const username = request.session.username as string
            if (typeof username !== 'string') logger.error('no username!')
            if (config.log)
                logger.info(
                    `received post call to ${
                        f.name
                    }#${randId} with ${JSON.stringify(request.body)}`
                )
            if (options?.wholeRequest) {
                // @ts-expect-error
                result = await f(request)
            } else {
                const body = { ...request.body }

                const game = getGameStateCursor(username)
                body.game = game
                // @ts-expect-error
                result = await doActionAndTakeSteps(game, f, body, options)
            }

            if (config.log) logger.info(`\n${f.name}#${randId} was called`)
            response.send({ status: 'success', result })
        } catch (e) {
            const err = e as unknown as Error
            const msg = JSON.stringify(err.message)
            logger.error(
                `exception occured in client call to ${f.name}: ${msg} ${err.stack}`
            )
            response.send({ status: 'error', message: JSON.stringify(e) })
        }
    })
}

type Func<T> = (u: T) => Promise<unknown> | unknown
async function doActionAndTakeSteps<T>(
    game: Gamecursor,
    f: Func<T>,
    args: T,
    options: CallOptions
) {
    const username = game.get('username')
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
