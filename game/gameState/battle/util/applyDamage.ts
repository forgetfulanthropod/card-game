import type { CharacterUid, BattleCursor, CharacterMeta } from 'shared'
import { calcPostEffectStats } from '../effects'

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

    scene.apply('damagesDealtThisTurn', damages => [
        ...damages,
        { amount: calcedDamage, targetUid },
    ])

    if (unblockedDamage === Number.NEGATIVE_INFINITY)
        throw new Error("unblocked damage wasn't calculated")

    return unblockedDamage
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
