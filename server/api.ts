import type { Request, Response } from 'express'
import { isGameAction } from 'game'
import { SBaobab } from 'sbaobab'
import type { ActionName, AllActionArgs, UserID } from 'shared'
import { satisfies } from 'shared/code'
import * as serverActions from './actions'
import { getGamestate } from './db'

import { processActionQueue } from './sleepLoop'
import { processingQueue } from './sleepLoop'
import { isServerAction } from './serverAction'


// TODO: change name to handleAction
export async function api<K extends ActionName>(
    method: K,
    args: AllActionArgs[K],
    userId?: UserID,
) {
    try {
        if (isServerAction(method)) {
            logger.info(
                `server api call: ${JSON.stringify({ method, ...args })}`
                )

            //@ts-expect-error
            const response = await serverActions[method]({ ...args })
            logger.info(`server api response: ${JSON.stringify(response)}`)
            return response
        } else if (isGameAction(method)) {
            if (typeof userId !== 'string') return err('no userId')
            const gamestate = await getGamestate(userId)
            if (gamestate == null) return err('no gamestate for this user')
            const actionArgs = { userId, method, ...args }
            logger.debug(`api call: ${JSON.stringify(actionArgs)}`)

            if (!processingQueue[userId]) processingQueue[userId] = []
            //@ts-expect-error
            processingQueue[userId].push(actionArgs)
            await processActionQueue(userId)
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
