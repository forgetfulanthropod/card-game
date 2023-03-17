import type { Request, Response } from 'express'
import { isGameAction } from 'game'
import { SBaobab } from 'sbaobab'
import type { ServerActions } from 'shared'
import { satisfies } from 'shared/code'
import * as serverActions from './actions'
import { getGamestate } from './db'

import { processActionQueue } from './sleepLoop'
import { processingQueue } from './sleepLoop'

satisfies<ServerActions>(serverActions)

export async function api(args: {
    username?: string | undefined
    method: string
    data: any
}) {
    const { username, method, data } = args
    try {
        if (method in serverActions) {
            const m = method as keyof typeof serverActions
            logger.debug(
                `server api call: ${JSON.stringify({ method, ...data })}`
            )
            const response = await serverActions[m]({ method, ...data })
            logger.debug(`server api response: ${JSON.stringify(response)}`)
            return response
        } else if (isGameAction(method)) {
            if (typeof username !== 'string') return err('no username')
            const gamestate = await getGamestate(username)
            if (gamestate == null) return err('no gamestate for this user')
            const actionArgs = { username, method, ...data }
            logger.debug(`api call: ${JSON.stringify(actionArgs)}`)

            if (!processingQueue[username]) processingQueue[username] = []
            processingQueue[username].push(actionArgs)
            await processActionQueue(username)
            return { status: 'success' }
        } else {
            return err('invalid method')
        }
    } catch (e) {
        const error = e as unknown as Error
        const msg = error.message
        logger.error(
            `exception occured in client call to ${method}: ${msg} ${error.stack}`
        )
        return err(msg)
    }
}

const err = (message: string) => {
    return { status: 'error', message: message }
}
