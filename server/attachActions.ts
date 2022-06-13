import type { Request, Response } from 'express'
import { actions as gameActions } from 'game'
import { camelCase } from 'lodash'
import { satisfies } from 'shared/code'
import * as serverActions from './actions'

import { getGamestate } from './db'
import { emitNewGamestate } from './IO'
import { doActionAndTakeSteps } from './sleepLoop'

const allActions = { ...gameActions, ...serverActions } as const
type ActionName = keyof typeof allActions
const noCommit = ['hello', 'maybeMakeUser'] as const
const wholeRequests = ['maybeMakeUser', 'makeNewUser'] as const
satisfies<readonly ActionName[]>(noCommit)
satisfies<readonly ActionName[]>(wholeRequests)

export async function api(req: Request, res: Response): Promise<void> {
    const username = req.body.username
    const method_ = req.body.method

    if (typeof username !== 'string') return err(res, 'no username')
    if (typeof method_ !== 'string') return err(res, 'no method')
    const method = camelCase(method_) as ActionName
    if (!(method in allActions)) return err(res, 'unknown method')
    try {
        const f = allActions[method]

        let result

        if (includes(wholeRequests, method)) {
            result = await allActions[method](req)
        } else {
            result = await doActionAndTakeSteps(
                username,
                // @ts-expect-error
                f,
                req.body
            )
        }
        if (!includes(noCommit, method)) {
            const gs = await getGamestate(username)
            if (gs == null) return err(res, `no gamestate for ${username}`)
            logger.info(['current scene name:', gs?.scene.name])
            logger.info('committing gamestate')
            logger.info(['api username:', username])
            emitNewGamestate(username, gs)
        }

        res.send({ status: 'success', result })
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

function includes<T>(arr: readonly T[], x: T | unknown): x is T {
    // @ts-expect-error
    return arr.includes(x)
}
