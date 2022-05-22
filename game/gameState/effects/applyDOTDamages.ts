import type { Characters, DamageMap, Effect, BattleCursor } from 'shared'

import { keys } from 'shared/code'
import { emit } from '@/util'
import { applyDamage } from '@/gameState'

export function applyDOTDamages(scene: BattleCursor): void {
    const damageMap = getDOTDamageMap(scene.get('allCharacters'))

    keys(damageMap).forEach(targetUid => {
        applyDamage({ targetUid, damage: damageMap[targetUid], scene })
    })

    emit({
        username: scene.get('username'),
        event: {
            type: 'DOT$',
            data: { damageMap },
        },
    })
}

function getDOTDamageMap(chars: Characters): DamageMap {
    const map: DamageMap = {}

    keys(chars).forEach(cUid => {
        const d = getDOTDamage(chars[cUid].effects)
        if (d > 0) map[cUid] = d
    })

    return map
}

function getDOTDamage(effects: Effect[]): number {
    let damage = 0

    effects.forEach(e => {
        if (e.damagesByRound == null) return

        if (e.remainingRounds <= 0) {
            throw Error('trying to apply exhausted effect')
        }

        damage += e.damagesByRound[e.damagesByRound.length - e.remainingRounds]
    })

    return damage
}
