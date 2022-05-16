import type { AttackData } from 'shared'

import type { BattleCursor } from 'shared'
import { emit } from '@/util'
import { vals } from '@/util'

import { getCharacterKeysAndDamages } from './attack'
import { putUpDoors } from './doors'
import applyMove from './move'
import { incrementXP } from './pcLeveling'
import { checkWinner } from './round'

export function handleMove(args: {
    scene: BattleCursor
    attackData: AttackData
}) {
    const { scene, attackData } = args

    // Dispatch move to client to trigger animation
    const damageKVs = getCharacterKeysAndDamages(attackData, scene)
    emit({
        username: scene.get('username'),
        event: {
            type: 'move$',
            sentAt: new Date().toLocaleDateString(),
            uid: srandom().toString().slice(6),
            data: {
                attackerIsPc: attackData.attacker.isPc,
                attackerUid: attackData.attacker.uid,
                defenderUids: attackData.defenders.map(d => d.uid),
                moveName: attackData.move.name,
                damageKVs,
            },
        },
    })

    // Update health, effects, and hasMoved
    applyMove(scene, attackData)
}

export function checkBattleOverMut(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))

    if (winner === 'PC') {
        scene.set('state', 'won')
        incrementXP(scene)
        putUpDoors(scene)
        return true
    } else if (winner === 'NPC') {
        scene.set('state', 'lost')
        return true
    }
    return false
}
