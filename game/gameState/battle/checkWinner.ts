import type { CharacterMeta } from 'shared'

export function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPc || c.health <= 0)) return 'PC'
    if (ac.every(c => !c.isPc || c.health <= 0)) return 'NPC'
    return null
}
