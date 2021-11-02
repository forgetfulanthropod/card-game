import type { BattleCursor } from '@/util'
import { commit, keys, sleep } from '@/util'

import { DEBUG, DEFAULT_WAIT } from '../../actions/startBattle'
import { doNpcMove } from './doNpcMove'
import { tl } from './logging'


export async function resetRound(scene: BattleCursor): Promise<void> {
    if (DEBUG)
        tl('resetting moves')
    const cursor = scene.select('allCharacters')
    keys(cursor.get())
        .map((k) => cursor.select(k).set('hasMoved', false))

    const playerStartsRound = srandom() < 0.5
    scene.set('isPlayerTurn', playerStartsRound)
    tl(playerStartsRound ? 'You start' : 'Enemy starts')
    if (!playerStartsRound) {
        await sleep(DEFAULT_WAIT)
        await doNpcMove('first move of round')
    }
    commit(scene)
}
