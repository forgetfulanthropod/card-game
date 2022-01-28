import type { CharacterUid } from '@shared'
import type { Value as VAngu } from 'angu'

import type { BattleCursor } from '@/util'

import { s } from './util/explainHelpers'

export function explain(damage: VAngu, times: VAngu) {
    let explication = 'deals ' + damage.eval() + ' damage'

    if (times != null) {
        const n = times.eval()
        explication += ` ${n} time${s(n)}`
    }

    return explication
}

export function execute({
    dslArgs: [damage, numTargets],
    targetUids,
    scene,
}: {
    dslArgs: VAngu[]
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    for (let i = 0; i < (numTargets != null ? numTargets.eval() : 1); i++) {
        if (targetUids[i] == null)
            throw new Error('less targetUids than targets!')

        console.log('applying damage')
        console.log({ damage: damage.eval(), enemyUid: targetUids[i] })

        applyDamage({ damage: damage.eval(), enemyUid: targetUids[i], scene })
    }
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
