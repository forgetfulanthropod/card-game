import type { Value as VAngu } from 'angu'
import type { CardHit } from 'shared'
import { mapToObj } from 'shared/code'
import type { ExecuteArgs } from './util'
import { s } from './util'
import { applyDamage } from '@/gameState'
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
    const numTargets: number =
        numTargetsAngu != null ? numTargetsAngu.eval() : 1

    const damages = mapToObj(targetUids, (uid, i) => [uid, damage])
    const cardHit: CardHit = {
        attacker: card.characterUid,
        cardName: card.name,
        damages,
    }
    emit({
        username: scene.get('username'),
        event: { type: 'damage$', data: cardHit },
    })

    for (let i = 0; i < numTargets; i++) {
        if (targetUids[i] == null)
            throw new Error('less targetUids than targets!')

        applyDamage({ damage, targetUid: targetUids[i], scene })
    }
}
