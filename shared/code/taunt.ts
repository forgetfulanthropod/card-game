import type { EffectId, CharacterMeta, CharacterClass, Species } from 'shared'

export const baseTauntClass: Record<CharacterClass, number> = {
    cleric: 5,
    knight: 3,
    rogue: 0,
    wizard: 0,
    bard: 0,
}

export const baseTauntSpecies: Record<Species, number> = {
    frogKnight: 1,
    penguinKnight: 1,
    warhog: 2,
}

export const effectTauntMap: Partial<Record<EffectId, number>> = {
    vulnerableDebuff: 8,
    unguardedDebuff: 4,
    unreadyDebuff: 2,
    berserkBuff: 5,
}

export const miscTauntValues: Record<any, number> = {
    playAttack: 3,
    over20dmg: 3,
    aggressive: 5,
    avoidant: -5,
    halfHP: 3,
}

export const calculateBaseTaunt = (cm: CharacterMeta): number => {
    if (!cm.isPc) return 0
    const taunt =
        (baseTauntClass[cm.class] ?? 0) +
        (baseTauntSpecies[cm.id as Species] ?? 0)
    return taunt
}

export const calculateTaunt = (
    cm: CharacterMeta,
    time?: 'last' | 'current'
) => {
    let t = !time || time === 'last' ? cm.lastTaunt : cm.taunt
    if (cm.health <= cm.constitution / 2) t += miscTauntValues['halfHP']
    for (const { id } of cm.effects) {
        t += effectTauntMap[id] ?? 0
    }
    return Math.max(t, 0)
}
