import type { BattleCursor } from '@/util'
import { keys, sleep } from '@/util'

import { doNpcMove } from './doNpcMove'
import { DEBUG, DEFAULT_WAIT, tl } from './startGame'


export async function resetRound(scene: BattleCursor): Promise<void> {
    if (DEBUG)
        tl('resetting moves')
    const cursor = scene.select('allCharacters')
    keys(cursor.get())
        .map((k) => cursor.select(k).setK('hasMoved', false))

    const playerStartsRound = Math.random() < 0.5
    scene.setK('isPlayerTurn', playerStartsRound)
    tl(playerStartsRound ? 'You start' : 'Enemy starts')
    if (!playerStartsRound) {
        await sleep(DEFAULT_WAIT)
        await doNpcMove('first move of round')
    }
    scene.commit()
}
