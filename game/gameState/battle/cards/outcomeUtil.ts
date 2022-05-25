import type { BattleScene, DamageMap } from 'shared'

export function extractDamages(
    prev: BattleScene,
    next: BattleScene
): DamageMap {
    const damages: DamageMap = {}
    for (const [uid, { health }] of Object.entries(prev.allCharacters)) {
        if (next.allCharacters[uid].health < health) {
            damages[uid] = health - next.allCharacters[uid].health
        }
    }
    return damages
}
