import type { AttackData, BattleScene } from '@shared'

import type { BattleCursor } from '@/util'
import { emit } from '@/util'
import { sleep, vals } from '@/util'

import { getCharacterKeysAndDamages } from './attack'
import { doNpcMove } from './cards/doNpcTurn'
import { getLivingChars, getUnmovedPc } from './characterGetters'
import { putUpDoors } from './doors'
import { tl, warn } from './logging'
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
}): Promise<void> {
    const { scene, allCharacters, attackData } = args

    // Dispatch move to client to trigger animation
    const damageMap = getCharacterKeysAndDamages(attackData, scene)
    emit({
        username: scene.get('username'),
        event: {
            type: 'move$',
            sentAt: new Date().toLocaleDateString(),
            uid: srandom().toString().slice(6),
            data: {
                attackerIsPc: attackData.attacker.isPc,
                attacker: attackData.attacker.uid,
                defenders: attackData.defenders.map(d => d.uid),
                moveName: attackData.move.name,
                damageMap,
            },
        },
    })

    // Update health, effects, and hasMoved
    applyMove(scene, allCharacters, attackData)

    // Check battle over
    const { allCharacters: newAllCharacters, selectedCharacter } = scene.get()
    checkBattleOver(scene)

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
            // scene.set('isPlayerTurn', false)
            await sleep(TIME_AFTER_PLAYER_MOVE + 500)
            await doNpcMove('NPC has extra turns', scene)
        }
    } else {
        if (alivePcs.some(c => !c.hasMoved)) {
            logger.info('will be player turn')
            // scene.set('isPlayerTurn', true)
        } else if (aliveNpcs.some(c => !c.hasMoved)) {
            logger.info('will be player turn')
            await sleep(DEFAULT_WAIT)
            await doNpcMove('no unmoved PC and NPC turn', scene)
        }
    }
}

export function checkBattleOver(scene: BattleCursor) {
    const winner = checkWinner(vals(scene.get('allCharacters')))

    if (winner === 'PC') {
        scene.set('state', 'won')
        incrementXP(scene)
        putUpDoors(scene)
    } else if (winner === 'NPC') {
        scene.set('state', 'lost')
    }
}
