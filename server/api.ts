import type { Request, Response } from 'express'
import { isGameAction } from 'game'
import { SBaobab } from 'sbaobab'
import type { ServerActions } from 'shared'
import { satisfies } from 'shared/code'
import * as serverActions from './actions'
import { getGamestate } from './db'

import { doActionAndTakeSteps } from './sleepLoop'

satisfies<ServerActions>(serverActions)

export async function api(req: Request, res: Response): Promise<void> {
    const method = req.body.method
    if (typeof method !== 'string') return err(res, 'no method')

    try {
        if (method in serverActions) {
            const m = method as keyof typeof serverActions
            const response = await serverActions[m](req.body)
            res.send(response)
        } else if (isGameAction(method)) {
            const username = req.body.username
            if (typeof username !== 'string') return err(res, 'no username')

            const gamestate = await getGamestate(username)
            if (gamestate == null) return err(res, 'no gamestate for this user')
            const game = new SBaobab(gamestate).select()
            await doActionAndTakeSteps({ ...req.body, game })
            res.send({ status: 'success' })
        } else {
            return err(res, 'invalid method')
        }
        return undefined
    } catch (e) {
        const err = e as unknown as Error
        const msg = err.message
        logger.error(
            `exception occured in client call to ${method}: ${msg} ${err.stack}`
        )
        res.send({ status: 'error', message: msg })
        return undefined
    }
}

function err(response: Response, message: string): void {
    logger.error(message)
    response.send({ status: 'error', message })
}
