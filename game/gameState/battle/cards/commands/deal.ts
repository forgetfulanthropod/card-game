import type { BattleCursor, CommandId } from 'shared'
import { getDamage } from '../../util/applyDamage'
import { evalAll, evalAllAsHtml } from './util'

import type { Executors, Explainers } from './util'
import { applyDamage, setNpcMoves } from '@/gameState'

export const explain: Explainers['deal'] = (dslArgs, context) => {
    const [damageHtml, times] = evalAllAsHtml(dslArgs)
    const [damage] = evalAll(dslArgs)
    // logger.info(
    //     JSON.stringify({
    //         damage: damageHtml,
    //         attacker: context.characterMeta,
    //         target: null,
    //     })
    // )
    let explication = `deals ${damageHtml.split('>')[0]}>${getDamage({
        damage: damage,
        attacker: context.characterMeta,
        target: null,
    })}</${damageHtml.split('</')[1]} damage`

    if (times != null) {
        explication += ` ${times} times`
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

    logger.info(`dealing to targetUids: ${targetUids}.. damage: ${damage}`)

    targetUids.forEach(targetUid =>
        applyDamage({
            damage,
            targetUid,
            attackerUid: command.characterUid,
            scene,
        })
    )

    logger.info(
        'damageChangesEnemyIntent(scene)' + damageChangesEnemyIntent(scene)
            ? 'yeap'
            : 'nooo'
    )
    if (damageChangesEnemyIntent(scene)) {
        setNpcMoves(scene)
    }
}

function damageChangesEnemyIntent(scene: BattleCursor): boolean {
    const specialCommanIds: CommandId[] = ['mimicAttack']

    return !!~scene.get('nextNpcCommands').findIndex(command => {
        return specialCommanIds.includes(command.command.id)
    })
}
