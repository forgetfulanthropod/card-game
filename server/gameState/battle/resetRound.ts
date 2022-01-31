import type { BattleCursor } from '@/util'
import { keys } from '@/util'

import { drawNewHand } from './cards/drawNewHand'
import { setRoundEnergy } from './energy/getRoundEnergy'
import { tl } from './logging'

// const DEFAULT_WAIT = 1000
const DEBUG = false

export function resetRound(scene: BattleCursor): void {
    if (DEBUG) tl('resetting moves')
    const cursor = scene.select('allCharacters')

    keys(cursor.get()).map(k => cursor.select(k).set('hasMoved', false))

    scene.set('isPlayerTurn', true)
    setRoundEnergy(scene)
    drawNewHand(scene)

    // const playerStartsRound = getRulebook().shouldCoinFlipEveryRound
    //     ? scene.select('playerStarts').get()
    //     : srandom() < 0.5
    // scene.set('isPlayerTurn', playerStartsRound)
    // tl(playerStartsRound ? 'You start' : 'Enemy starts')
    // if (!playerStartsRound) {
    //     await sleep(DEFAULT_WAIT)
    //     await doNpcMove('first move of round', scene)
    // }
}
