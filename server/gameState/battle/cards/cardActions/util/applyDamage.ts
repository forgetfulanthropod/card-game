import type { CharacterUid } from '@shared'

import type { BattleCursor } from '@/util'

export function applyDamage({
    damage,
    targetUid,
    scene,
}: {
    damage: number
    targetUid: CharacterUid
    scene: BattleCursor
}): number {
    let unblockedDamage = Number.NEGATIVE_INFINITY

    scene.select('allCharacters').apply(targetUid, c => {
        let health = c.health
        let block = c.block

        unblockedDamage = damage - block

        if (unblockedDamage > 0) {
            block = 0
            health -= unblockedDamage
        } else {
            block -= damage
        }

        return { ...c, health, block }
    })

    if (unblockedDamage === Number.NEGATIVE_INFINITY)
        throw new Error("unblocked damage wasn't calculated")

    return unblockedDamage
}
