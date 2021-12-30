import { getRulebook } from '@/rulebook'
import type { BattleCursor } from '@/util'
import { commit, keys, sleep } from '@/util'

import { doNpcMove } from './doNpcMove'
import { tl } from './logging'

const DEFAULT_WAIT = 1000
const DEBUG = false

export async function resetRound(
    scene: BattleCursor,
    username: string
): Promise<void> {
    if (DEBUG) tl('resetting moves')
    const cursor = scene.select('allCharacters')
    keys(cursor.get()).map(k => cursor.select(k).set('hasMoved', false))

    const playerStartsRound = getRulebook().shouldCoinFlipEveryRound
        ? scene.select('playerStarts').get()
        : srandom() < 0.5
    scene.set('isPlayerTurn', playerStartsRound)
    tl(playerStartsRound ? 'You start' : 'Enemy starts')
    if (!playerStartsRound) {
        await sleep(DEFAULT_WAIT)
        await doNpcMove('first move of round', username)
    }
    commit(scene, username)
}
