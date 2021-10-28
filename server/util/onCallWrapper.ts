import { getApp } from '@/index'


const config = {
    log: true,
    method: 'post' as 'post' | 'get',
}

function makeRandId() { return Math.random().toString().slice(2, 6) }

export function onCallWrapper<Args, ReturnType>(f: ((u: Args) => ReturnType) | ((u: Args) => Promise<ReturnType>)): () => void {
    return () => {
        logger.info(`attaching route  ${JSON.stringify(f.name)}`)
        getApp().post('/' + f.name, async (request, response) => {
            // return () => getApp()[config.method]('/' + f.name, async (request, response) => {
            const randId = makeRandId()
            try {
                // debugger
                let result: ReturnType | null = null
                if (config.method === 'get') {
                    if (config.log) { logger.info(`received ${config.method} call to ${f.name}#${randId} with ${JSON.stringify(request.query)}`) }
                    result = await f(request.query as unknown as Args)
                } else {
                    // debugger
                    if (config.log) { logger.info(`received ${config.method} call to ${f.name}#${randId} with ${JSON.stringify(request.body)}`) }
                    result = await f(request.body)
                }
                if (config.log) { logger.info(`    ${f.name}#${randId} responding with ${JSON.stringify(result)}`) }
                response.send({ status: 'success', result })
            } catch (e) {
                logger.error(`exception occured in client call to ${f.name}: `, e)
                response.send({ status: 'error', message: JSON.stringify(e) })
            }
        })
    }
}
