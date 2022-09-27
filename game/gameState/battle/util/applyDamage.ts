import type {
    CharacterUid,
    BattleCursor,
    CharacterMeta,
    CommandId,
} from 'shared'
import { calcPostEffectStats } from '../effects'
import { removeDeadCharacterCards } from './removeDeadCharacterCards'
import { updateNpcMoves } from '@/gameState'

export function applyDamage(args: {
    damage: number
    targetUid: CharacterUid
    attackerUid: CharacterUid
    scene: BattleCursor
}): number {
    const { damage, targetUid, scene, attackerUid } = args
    const calcedDamage = getDamage({
        attacker: scene.get('allCharacters', attackerUid),
        target: scene.get('allCharacters', targetUid),
        damage,
    })

    const unblockedDamage = applyCalcedDamage(scene, targetUid, calcedDamage)

    manageSideEffectsOfNewDamage(scene, targetUid, calcedDamage)

    if (unblockedDamage === Number.NEGATIVE_INFINITY)
        throw new Error("unblocked damage wasn't calculated")

    return unblockedDamage
}

function applyCalcedDamage(
    scene: BattleCursor,
    targetUid: CharacterUid,
    calcedDamage: number
) {
    let unblockedDamage = Number.NEGATIVE_INFINITY

    scene.select('allCharacters').apply(targetUid, c => {
        let health = c.health
        let block = c.block

        unblockedDamage = calcedDamage - block

        if (unblockedDamage > 0) {
            block = 0
            health -= unblockedDamage
        } else {
            block -= calcedDamage
        }

        return { ...c, health, block }
    })

    return unblockedDamage
}

function manageSideEffectsOfNewDamage(
    scene: BattleCursor,
    targetUid: CharacterUid,
    calcedDamage: number
) {
    if (didTargetDie(scene, targetUid)) removeDeadCharacterCards(scene)

    scene.apply('damagesDealtThisTurn', damages => [
        ...damages,
        { amount: calcedDamage, targetUid },
    ])

    if (damageChangesEnemyIntent(scene)) {
        logger.info('updating the NPC moves due to enemy damage')
        updateNpcMoves(scene)
    }
}

function didTargetDie(scene: BattleCursor, targetUid: CharacterUid) {
    return scene.select('allCharacters').get(targetUid).health <= 0
}

export function getDamage({
    attacker,
    target,
    damage,
}: {
    attacker: CharacterMeta
    target: CharacterMeta | null
    damage: number
}) {
    const multiplicand =
        calcPostEffectStats(attacker).damageDealMultiplicand *
        (target ? calcPostEffectStats(target).damageTakeMultiplicand : 1)
    const calcedDamage = Math.ceil(damage * multiplicand)
    return calcedDamage
}

function damageChangesEnemyIntent(scene: BattleCursor): boolean {
    const specialCommanIds: CommandId[] = ['mimicAttack']

    return !!~scene.get('nextNpcCommands').findIndex(command => {
        return specialCommanIds.includes(command.command.id)
    })
}
