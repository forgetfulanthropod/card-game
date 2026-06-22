import type { CharacterPlaceIndex, ServerActions } from 'shared'
import { setGlobalRandomSeed, doGameAction } from 'game'
import { SBaobab } from 'sbaobab'
import { setInitialGameState } from './setInitialGameState'
import { clearActionQueue, syncGameStateToClient } from '@/sleepLoop'
import { getGamestate } from '@/db'
import { createRun } from '@/storage'

export const prepareRun: ServerActions['prepareRun'] = async ({
    userId,
    daily,
    plain,
    enhanced,
    autoStart,
}) => {
    logger.info(
        `prepareRun for ${userId}, daily=${!!daily}, autoStart=${!!autoStart}`
    )

    clearActionQueue(userId)

    if (daily) {
        const today = new Date().toISOString().slice(0, 10)
        setGlobalRandomSeed(`daily-${today}`)
    } else {
        setGlobalRandomSeed(`adv-${Date.now()}`)
    }

    await setInitialGameState({ userId })

    const usePlain = plain !== false && !enhanced
    const useEnhanced = !!enhanced

    const gamestate = await getGamestate(userId)
    if (gamestate == null) {
        throw new Error('no gamestate after reset')
    }
    const game = new SBaobab(gamestate).select()
    game.select('scene').merge({
        rollPlain: usePlain,
        rollEnhanced: useEnhanced,
    })
    syncGameStateToClient(userId, game)

    if (!autoStart) return

    for (let i = 0; i < 3; i++) {
        doGameAction({
            method: 'rollKaiju',
            placeIndex: i as CharacterPlaceIndex,
            plain: usePlain,
            enhanced: useEnhanced,
            game,
            userId,
        })
    }

    const selected = game.select('scene').get('selectedCharacters')
    if (!selected?.every(c => c != null)) {
        throw new Error('failed to roll party for menu start')
    }

    const runId = createRun(userId, game.get())

    doGameAction({
        method: 'changeScene',
        newSceneName: 'battle',
        game,
        userId,
    })

    doGameAction({
        method: 'setRunId',
        userId,
        runId,
        game,
    })

    syncGameStateToClient(userId, game)

    return { runId }
}
