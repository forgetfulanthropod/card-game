import type { AttackData, BattleScene } from '@shared'

import type { BattleCursor } from '@/util'
import { emit } from '@/util'
import { commit, sleep, vals } from '@/util'

import { getCharacterKeysAndDamages } from './attack'
import { getLivingChars, getUnmovedPc } from './characterGetters'
import { doNpcMove } from './doNpcMove'
import { putUpDoors } from './doors'
import { tl, warn } from './logging'
import { claimLoot } from './loot'
import applyMove from './move'
import { incrementXP } from './pcLeveling'
import { resetRound } from './resetRound'
import { checkMoveAvailable, checkWinner } from './round'


const TIME_AFTER_PLAYER_MOVE = 1000
const DEFAULT_WAIT = 1000

export async function handleMove(args: {
    scene: BattleCursor
    allCharacters: BattleScene['allCharacters']
    attackData: AttackData
    username: string
}): Promise<void> {
    const { scene, allCharacters, attackData, username } = args

    // Dispatch move to client to trigger animation
    const damageMap = getCharacterKeysAndDamages(attackData, username)
    emit({
        username: args.username, event: 'move$', data: {
            attackerIsPc: attackData.attacker.isPc,
            attacker: attackData.attacker.uid,
            defenders: attackData.defenders.map(d => d.uid),
            move: attackData.move,
            damageMap,
        },
    })

    // Update health, effects, and hasMoved
    applyMove(scene, allCharacters, attackData, username)

    // Check battle over
    const { allCharacters: newAllCharacters, selectedCharacter } = scene.get()
    const winner = checkWinner(vals(newAllCharacters))

    if (winner === 'PC') {
        scene.set('state', 'won')
        incrementXP(scene)
        claimLoot(username)
        putUpDoors(scene)
        return
    } else if (winner === 'NPC') {
        scene.set('state', 'lost')
        commit(scene, username)
        return
    }

    // Check reset round
    const isMoveAvailable = checkMoveAvailable(vals(newAllCharacters))

    if (!isMoveAvailable) {
        await resetRound(scene, args.username)
        return
    }

    // DO NEXT TURN
    const { alivePcs, aliveNpcs } = getLivingChars(newAllCharacters)

    if (attackData.attacker.isPc) {
        // change to unmoved PC if there is one
        const newPc = getUnmovedPc(vals(allCharacters), selectedCharacter)
        if (newPc == null) {
            warn('no unmoved PC')
        } else {
            tl(`selecting character ${newPc.uid}`)
            scene.set('selectedCharacter', newPc.uid)
        }
        // if there's another unmoved NPC then make it strike
        if (aliveNpcs.some(c => !c.hasMoved)) {
            logger.info('will be NPC turn')
            scene.set('isPlayerTurn', false)
            await sleep(TIME_AFTER_PLAYER_MOVE + 500)
            await doNpcMove('NPC has extra turns', username)
        }
    } else {
        if (alivePcs.some(c => !c.hasMoved)) {
            logger.info('will be player turn')
            scene.set('isPlayerTurn', true)
        } else if (aliveNpcs.some(c => !c.hasMoved)) {
            logger.info('will be player turn')
            await sleep(DEFAULT_WAIT)
            await doNpcMove('no unmoved PC and NPC turn', username)
        }
    }
    commit(scene, username)
}
