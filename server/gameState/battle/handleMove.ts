import type { AttackData, BattleScene, NetworkAttackData, NetworkEvent } from '@shared'
import type { SCursor } from 'baobab'
import { memoize } from 'lodash'

import type { BattleCursor } from '@/util'
import { commit, getGameStateCursor, makeServerEventEmitter, sleep, vals } from '@/util'

import { DEFAULT_WAIT, TIME_AFTER_PLAYER_MOVE } from '../../actions/startBattle'
import { getCharacterKeysAndDamages } from './attack'
import { doNpcMove } from './doNpcMove'
import { putUpDoors } from './doors'
import { tl, warn } from './logging'
import { checkMoveAvailable, checkWinner, getLivingChars, getUnmovedPc } from './misc'
import applyMove from './move'
import { incrementXP } from './pcLeveling'
import { resetRound } from './resetRound'


export async function handleMove(
    scene: BattleCursor,
    allCharacters: BattleScene['allCharacters'],
    attackData: AttackData,
): Promise<void> {

    const move$ = getMoveChannel()

    // Dispatch move to client to trigger animation
    const damageMap = getCharacterKeysAndDamages(attackData)
    move$.emit({
        attackerIsPc: attackData.attacker.isPc,
        attacker: attackData.attacker.uid,
        defenders: attackData.defenders.map(d => d.uid),
        move: attackData.move,
        damageMap,
    })

    // Update health, effects, and hasMoved
    applyMove(scene, allCharacters, attackData)

    // Check battle over
    const { allCharacters: newAllCharacters, selectedCharacter } = scene.get()
    const winner = checkWinner(vals(newAllCharacters))

    if (winner === 'PC') {
        scene.set('state', 'won')
        incrementXP(scene)
        putUpDoors(scene)
        return
    } else if (winner === 'NPC') {
        scene.set('state', 'lost')
        commit(scene)
        return
    }

    // Check reset round
    const isMoveAvailable = checkMoveAvailable(vals(newAllCharacters))

    if (!isMoveAvailable) {
        await resetRound(scene)
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
            await doNpcMove('NPC has extra turns')
        }
    } else {
        if (alivePcs.some(c => !c.hasMoved)) {
            logger.info('will be player turn')
            scene.set('isPlayerTurn', true)
        } else if (aliveNpcs.some(c => !c.hasMoved)) {
            logger.info('will be player turn')
            await sleep(DEFAULT_WAIT)
            await doNpcMove('no unmoved PC and NPC turn')
        }
    }
    commit(scene)
}
const getMoveChannel = memoize(function getMoveChannel() {
    const eventsCursor: SCursor<NetworkEvent<'move', NetworkAttackData>[]> = (getGameStateCursor('alice')).select('events').select('move')
    const move$ = makeServerEventEmitter<'move', NetworkAttackData>('move', eventsCursor)
    return move$
})
