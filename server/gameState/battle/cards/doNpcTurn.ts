import type { BattleCursor } from '@/util'
import { commit } from '@/util'
import { sleep, vals } from '@/util'

import { resetRound } from '..'
import { ac, livingPcsRemain, readyNpcsRemain } from '../characterGetters'
import { handleMove } from '../handleMove'
import { tl, warn } from '../logging'
import { checkWinner, getNpcMove } from '../round'

const TIME_AFTER_PLAYER_MOVE = 1000
const TIME_BETWEEN_NPC_MOVES = 1000

export async function doNpcTurn(scene: BattleCursor) {
    // if there's another unmoved NPC then make it strike

    await sleep(TIME_AFTER_PLAYER_MOVE)

    while (!scene.get('isPlayerTurn') && readyNpcsRemain(ac(scene))) {
        logger.info('will be NPC turn')
        await doNpcMove('NPCs have extra turns', scene)
        commit(scene, scene.get('username'))
        await sleep(TIME_BETWEEN_NPC_MOVES)
    }

    resetRound(scene)
}

export async function doNpcMove(
    reason: string,
    scene: BattleCursor
): Promise<void> {
    tl(`npcMove(reason: ${reason})`)
    const { allCharacters, isPlayerTurn } = scene.get()

    const prefix = 'npc. not moving cuz '
    if (checkWinner(vals(allCharacters)) != null) {
        warn(prefix + 'battle is won')
        return
    }
    if (isPlayerTurn) {
        warn(prefix + 'it is player turn')
        return
    }
    if (!livingPcsRemain(ac(scene))) {
        warn(prefix + 'none are alive')
        return
    }
    if (!readyNpcsRemain(ac(scene))) {
        warn(prefix + 'every npc has moved')
        scene.set('isPlayerTurn', true)
        return
    }
    const move = getNpcMove(vals(allCharacters), scene)
    await handleMove({ scene, allCharacters, attackData: move })
}
