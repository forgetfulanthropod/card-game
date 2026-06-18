import type { ServerActions } from 'shared'
import { setGlobalRandomSeed } from 'game'
import { setInitialGameState } from './setInitialGameState'
import { getGamestate } from '@/db'
import { emitUpdatedGameState } from '@/IO'

export const prepareRun: ServerActions['prepareRun'] = async ({ userId, daily }) => {
    logger.info(`prepareRun for ${userId}, daily=${!!daily}`)
    if (daily) {
        const today = new Date().toISOString().slice(0, 10)
        // daily seed shared for the day
        setGlobalRandomSeed(`daily-${today}`)
    } else {
        // fresh random for adventure run
        setGlobalRandomSeed(`adv-${Date.now()}`)
    }
    const existing = await getGamestate(userId)
    if (!existing) {
        await setInitialGameState({ userId })
    } else {
        emitUpdatedGameState(userId, existing)
    }
}