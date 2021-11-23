import { getApp } from '@/index'

import { fullUserCommit, getGameStateCursor } from '.'

const config = { log: true }
// const log = (...args: unknown[]) => true && logger.info(...args)

function makeRandId() { return srandom().toString().slice(2, 6) }

export function onCallWrapper<Args, ReturnType>(
    f: ((u: Args) => ReturnType) | ((u: Args) => Promise<ReturnType>),
    options?: {
        disableCommit?: boolean,
        wholeRequest?: boolean,
    }
): void {
    logger.info(`attaching route  ${JSON.stringify(f.name)}`)
    getApp().post('/' + f.name, async (request, response) => {
        const randId = makeRandId()
        try {
            let result: ReturnType | null = null
            // @ts-expect-error
            const username = request.session.username as string
            if (typeof username !== 'string')
                logger.error('no username!')
            if (config.log)
                logger.info(`received post call to ${f.name}#${randId} with ${JSON.stringify(request.body)}`)
            if (options?.wholeRequest) {
                // @ts-expect-error
                result = await f(request)
            } else {
                request.body.username = username
                result = await f(request.body)
            }
            if (options?.disableCommit !== true)
                fullUserCommit(getGameStateCursor(username))
            if (config.log)
                logger.info(`    ${f.name}#${randId} responding with ${JSON.stringify(result)}`)
            response.send({ status: 'success', result })
        } catch (e) {
            const err = e as unknown as Error
            logger.error(`exception occured in client call to ${f.name}: ${JSON.stringify(err.message)} ${err.stack}`)
            response.send({ status: 'error', message: JSON.stringify(e) })
        }
    })
}
