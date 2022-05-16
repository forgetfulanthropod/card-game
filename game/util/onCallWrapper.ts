import { getApp } from '@/index'

import { commit, getGameStateCursor } from '.'

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
            // @ts-expect-error
            const socketId: string = request.session.socketio
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
                body.username = username
                body.socketId = socketId
                result = await f(body)
            }
            if (options?.disableCommit !== true)
                commit(getGameStateCursor(username), username)
            if (config.log) logger.info(`\n${f.name}#${randId} was called`)
            // logger.info(
            //     `    ${f.name}#${randId} responding with ${JSON.stringify(
            //         result
            //     )}`
            // )
            response.send({ status: 'success', result })
        } catch (e) {
            const err = e as unknown as Error
            logger.error(
                `exception occured in client call to ${
                    f.name
                }: ${JSON.stringify(err.message)} ${err.stack}`
            )
            response.send({ status: 'error', message: JSON.stringify(e) })
        }
    })
}
