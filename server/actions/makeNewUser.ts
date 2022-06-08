// import { setUser } from '@/database'

import { getInitialGameState } from 'game'
import type { Gamestate } from 'shared'
import type { Request } from 'express'
import { setGamestate } from '@/db'

export const makeNewUser = async (req: Request): Promise<Gamestate> => {
    logger.info('making new user')
    const gs = getInitialGameState(req.body.username)
    logger.info([
        'selected characters:',
        gs.scene.name === 'entry' ? gs.scene.selectedCharacters : [],
    ])
    logger.info(['initial gamestate scene:', gs.scene.name])
    logger.info(['makeNewUser username:', req.body.username])
    await setGamestate(req.body.username, gs)
    logger.info('gamestate has been set')
    return gs
}
