import type { Value as VAngu } from 'angu'
import type {
    BattleCursor,
    Card,
    CharacterUid,
    NetworkAttackData,
} from 'shared'
import type { ExecuteArgs } from './util'
import { applyDamage, s } from './util'
import { emit } from '@/util'

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

        applyDamage({ damage, targetUid: targetUids[i], scene })
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
    const attackerIsPc = scene.get(
        'allCharacters',
        card.characterUid,
        'isPc'
    ) as boolean
    const damageKVs = targetUids.map(key => ({ key, damage }))

    const data: NetworkAttackData = {
        attackerUid: card.characterUid,
        moveName: card.name,
        attackerIsPc,
        defenderUids: targetUids,
        damageKVs,
    }

    emit({
        username: scene.get('username'),
        event: {
            type: 'move$',
            data,
        },
    })
}
