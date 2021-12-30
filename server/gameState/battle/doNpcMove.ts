import { commit, getBattleScene, vals } from '@/util'

import { getLivingChars } from './characterGetters'
import { handleMove } from './handleMove'
import { tl, warn } from './logging'
import { checkWinner, getNpcMove } from './round'

export async function doNpcMove(
    reason: string,
    username: string
): Promise<void> {
    const scene = getBattleScene(username)
    tl(`npcMove(reason: ${reason})`)
    const { allCharacters, isPlayerTurn } = scene.get()
    const { alivePcs, aliveNpcs } = getLivingChars(allCharacters)
    const prefix = 'npc. not moving cuz '
    if (checkWinner(vals(allCharacters)) != null) {
        warn(prefix + 'battle is won')
        return
    }
    if (isPlayerTurn) {
        warn(prefix + 'it is player turn')
        return
    }
    if (alivePcs.length === 0) {
        warn(prefix + 'none are alive')
        return
    }
    if (aliveNpcs.every(c => c.hasMoved)) {
        warn(prefix + 'every npc has moved')
        scene.set('isPlayerTurn', true)
        commit(scene, username)
        return
    }
    const move = getNpcMove(vals(allCharacters), username)
    await handleMove({ scene, allCharacters, attackData: move, username })
}
