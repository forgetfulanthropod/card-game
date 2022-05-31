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
    dslArgs: [damageAngu],
    command,
    targetUids,
    scene,
    calculatedStats,
}: ExecuteArgs) {
    const damage = damageAngu.eval() as number
    const expectedNumTargets = command.targetNum
    if (expectedNumTargets !== targetUids.length) {
        logger.error(
            `command ${command.id} received ${targetUids.length} targets, but ${expectedNumTargets} were expected`
        )
        return
    }

    const damages = mapToObj(targetUids, () => damage)
    const cardHit: CardHit = {
        attacker: command.characterUid,
        cardName: command.name,
        damages,
    }
    emit({
        username: scene.get('username'),
        event: { type: 'damage$', data: cardHit },
    })

    targetUids.forEach(targetUid =>
        applyDamage({
            damage,
            targetUid,
            scene,
            // TODO:
            multiplier: calculatedStats.damageTakeMultiplier,
        })
    )
}
