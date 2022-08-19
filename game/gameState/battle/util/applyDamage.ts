import type { CharacterUid, BattleCursor } from 'shared'

export function applyDamage(args: {
    damage: number
    targetUid: CharacterUid
    scene: BattleCursor
    multiplier: number
}): number {
    const { damage, targetUid, scene, multiplier } = args
    let unblockedDamage = Number.NEGATIVE_INFINITY

    scene.select('allCharacters').apply(targetUid, c => {
        let health = c.health
        let block = c.block
        const calcedDamage = Math.ceil(damage * multiplier)

        unblockedDamage = calcedDamage - block

        if (unblockedDamage > 0) {
            block = 0
            health -= unblockedDamage
        } else {
            block -= calcedDamage
        }

        return { ...c, health, block }
    })

    if (unblockedDamage === Number.NEGATIVE_INFINITY)
        throw new Error("unblocked damage wasn't calculated")

    return unblockedDamage
}
