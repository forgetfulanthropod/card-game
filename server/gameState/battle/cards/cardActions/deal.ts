import type { CharacterUid } from '@shared'
import type { Value } from 'angu'

import type { BattleCursor } from '@/util'

import { s } from './util/explainHelpers'

export function explain(damage: Value, times: Value) {
    let explication = 'deals ' + damage.eval() + ' damage'

    if (times != null) {
        const n = times.eval()
        explication += ` ${n} time${s(n)}`
    }

    return explication
}

export function interpret({
    damage,
    times = 1,
    scene,
    defenderUids,
}: {
    damage: number
    times?: number
    scene: BattleCursor
    defenderUids: CharacterUid[]
}) {
    // for (let i = 0; i < times; i++) {
    //     if (defenderUids[i] == null)
    //         throw new Error('more times than defenderIds?')
    //     applyDamage({ damage, enemyUid: defenderUids[i], scene })
    // }
}

function applyDamage({
    damage,
    enemyUid,
    scene,
}: {
    damage: number
    enemyUid: CharacterUid
    scene: BattleCursor
}): void {
    scene.select('allCharacters', enemyUid).apply('health', h => h - damage)
}
