import { getApp } from '@/index'


const config = {
    log: true,
    method: 'post' as 'post' | 'get',
}

function makeRandId() { return srandom().toString().slice(2, 6) }

export function onCallWrapper<Args, ReturnType>(f: ((u: Args) => ReturnType) | ((u: Args) => Promise<ReturnType>)): void {
    logger.info(`attaching route  ${JSON.stringify(f.name)}`)
    getApp().post('/' + f.name, async (request, response) => {
        // return () => getApp()[config.method]('/' + f.name, async (request, response) => {
        const randId = makeRandId()
        try {
            // debugger
            let result: ReturnType | null = null
            if (config.method === 'get') {
                // @ts-expect-error
                const fullRequest = { ...request.query, username: request.session.username }
                if (config.log) { logger.info(`received ${config.method} call to ${f.name}#${randId} with ${JSON.stringify(fullRequest)}`) }
                result = await f(fullRequest as unknown as Args)
                // TODO: could commit scene here instead of at the end of every function
            } else {
                // debugger
                // @ts-expect-error
                const fullBody = { ...request.body, username: request.session.username }
                if (config.log) { logger.info(`received ${config.method} call to ${f.name}#${randId} with ${JSON.stringify(fullBody)}`) }
                result = await f(fullBody)
            }
            if (config.log) { logger.info(`    ${f.name}#${randId} responding with ${JSON.stringify(result)}`) }
            response.send({ status: 'success', result })
        } catch (e) {
            const err = e as unknown as Error
            logger.error(`exception occured in client call to ${f.name}: ${JSON.stringify(err.message)} ${err.stack}`)
            response.send({ status: 'error', message: JSON.stringify(e) })
        }
    })
}
