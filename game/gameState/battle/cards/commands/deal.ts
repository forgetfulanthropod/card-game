import { s, evalAll } from './util'

import type { Executors, Explainers } from './util'
import { applyDamage, calcPostEffectStats } from '@/gameState'

export const explain: Explainers['deal'] = dslArgs => {
    const [damage, times] = evalAll(dslArgs)
    let explication = 'deals ' + Math.ceil(damage) + ' damage'

    if (times != null) {
        explication += ` ${times} time${s(times)}`
    }

    return explication
}

export const execute: Executors['deal'] = ({
    dslArgs,
    scene,
    command,
    targetUids,
}) => {
    const [damage, _times] = evalAll(dslArgs)
    const expectedNumTargets = command.targetNum
    if (expectedNumTargets !== targetUids.length) {
        logger.error(
            `command ${command.id} received ${targetUids.length} targets, but ${expectedNumTargets} were expected`
        )
        return
    }

    // const damages = mapToObj(targetUids, () => damage)
    // const cardHit: CardHit = {
    //     attacker: command.characterUid,
    //     cardName: command.name,
    //     damages,
    // }
    // emit({
    //     username: scene.get('username'),
    //     event: { type: 'move$', data: cardHit },
    // })

    targetUids.forEach(targetUid =>
        applyDamage({
            damage,
            targetUid,
            scene,
            multiplier: calcPostEffectStats(
                scene.get('allCharacters', targetUid)
            ).damageTakeMultiplier,
        })
    )
}
