import type { Card, CharacterUid } from '@shared'
import type { Value as VAngu } from 'angu'

import type { BattleCursor } from '@/util'
import { emit } from '@/util'

import { s } from './util/explainHelpers'
import type { ExecuteArgs } from './util/types'

export function explain(damage: VAngu, times: VAngu) {
    let explication = 'deals ' + damage.eval() + ' damage'

    if (times != null) {
        const n = times.eval()
        explication += ` ${n} time${s(n)}`
    }

    return explication
}

export function execute({
    dslArgs: [damageAngu, numTargetsAngu],
    card,
    targetUids,
    scene,
}: ExecuteArgs) {
    const damage = damageAngu.eval() as number
    const numTargets = numTargetsAngu != null ? numTargetsAngu.eval() : 1

    emitMove({ card, damage, targetUids, scene })

    for (let i = 0; i < numTargets; i++) {
        if (targetUids[i] == null)
            throw new Error('less targetUids than targets!')

        applyDamage({ damage, enemyUid: targetUids[i], scene })
    }
}

function emitMove({
    card,
    damage,
    targetUids,
    scene,
}: {
    card: Card
    damage: number
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    const attackerIsPc = scene.get('allCharacters', card.characterUid, 'isPc')
    const damageMap = targetUids.map(key => ({ key, damage }))

    emit({
        username: scene.get('username'),
        event: {
            type: 'move$',
            sentAt: new Date().toLocaleDateString(),
            uid: srandom().toString().slice(6),
            data: {
                attackerIsPc,
                attacker: card.characterUid,
                defenders: targetUids,
                move: { name: card.name },
                damageMap,
            },
        },
    })
}

function getCharacterKeysAndDamages(targetUids)

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
