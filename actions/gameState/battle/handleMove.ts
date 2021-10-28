import type { AttackData, BattleScene, Gamestate, NetworkAttackData, NetworkEvent } from '@shared'
import { memoize } from 'lodash'

import type { BattleCursor, DataCursor } from '@/util'
import { getGameStateCursor, makeServerEventEmitter, sleep, vals } from '@/util'

import { getCharacterKeysAndDamages } from './attack'
import { doNpcMove } from './doNpcMove'
import { putUpDoors } from './doors'
import { incrementXP } from './experiencePoints'
import { checkMoveAvailable, checkWinner, getLivingChars, getUnmovedPc } from './misc'
import applyMove from './move'
import { resetRound } from './resetRound'
import { DEFAULT_WAIT, TIME_AFTER_PLAYER_MOVE, tl, warn } from './startGame'


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
        scene.setK('state', 'won')
        incrementXP(scene)
        putUpDoors(scene)
        return
    } else if (winner === 'NPC') {
        scene.setK('state', 'lost')
        scene.commit()
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
            scene.setK('selectedCharacter', newPc.uid)
        }
        // if there's another unmoved NPC then make it strike
        if (aliveNpcs.some(c => !c.hasMoved)) {
            logger.info('will be NPC turn')
            scene.setK('isPlayerTurn', false)
            await sleep(TIME_AFTER_PLAYER_MOVE + 500)
            await doNpcMove('NPC has extra turns')
        }
    } else {
        if (alivePcs.some(c => !c.hasMoved)) {
            logger.info('will be player turn')
            scene.setK('isPlayerTurn', true)
        } else if (aliveNpcs.some(c => !c.hasMoved)) {
            logger.info('will be player turn')
            await sleep(DEFAULT_WAIT)
            await doNpcMove('no unmoved PC and NPC turn')
        }
    }
    scene.commit()
}
const getMoveChannel = memoize(function getMoveChannel() {
    const eventsCursor: DataCursor<Gamestate, NetworkEvent<'move', NetworkAttackData>[]> = (getGameStateCursor('alice')).select('events')
    const move$ = makeServerEventEmitter<'move', NetworkAttackData>('move', eventsCursor)
    return move$
})
