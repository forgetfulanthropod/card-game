import { clearHappened, getHappened } from 'game'

import { getApp } from './index'
import { commit, emit, getGameStateCursor } from './treeUtils'

const config = { log: true }
// const log = (...args: unknown[]) => true && logger.info(...args)

function makeRandId() {
    return srandom().toString().slice(2, 6)
}

export function onCallWrapper<Args, ReturnType>(
    f: ((u: Args) => ReturnType) | ((u: Args) => Promise<ReturnType>),
    options?: {
        disableCommit?: boolean
        wholeRequest?: boolean
    }
): void {
    logger.info(`attaching route  ${JSON.stringify(f.name)}`)
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
                result = await f(body)
            }

            for (const event of getHappened(username)) {
                emit({ username, event })
            }
            clearHappened(username)

            if (options?.disableCommit !== true)
                commit(getGameStateCursor(username), username)
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
