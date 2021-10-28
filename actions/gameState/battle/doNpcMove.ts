import { getBattleScene, vals } from '@/util'

import { handleMove } from './handleMove'
import { checkWinner, getLivingChars, getNpcMove } from './misc'
import { tl, warn } from './startGame'


export async function doNpcMove(_reason?: string) {
    const scene = getBattleScene('alice')
    tl(`npcMove(reason: ${_reason})`)
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
        scene.setK('isPlayerTurn', true)
        scene.commit()
        return
    }
    const move = getNpcMove(vals(allCharacters))
    await handleMove(scene, allCharacters, move)
}
