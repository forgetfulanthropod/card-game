import type { NpcCommandDefinition } from 'shared'

/**Startling Spook (Applies Unguarded x, Fatigue x) */
export const startlingSpook = (x: number, y: number): NpcCommandDefinition => ({
    actions: `effect("unguarded",${x}); effect("fatigued",${y})`,
    id: `startlingSpook(${x},${y})`,
    name: `Startling Spook ${x}-${y}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Surprise Allergy (deal 50% of attack damage, applies Poison X if unblocked, Fatigue X) */
export const surpriseAllergy = (
    x: number,
    y: number
): NpcCommandDefinition => ({
    actions: `ifDamageDealt(deal(strength/2), chain(effect("poisoned",${x}), effect("fatigued",${y})))`,
    id: `surpriseAllergy(${x},${y})`,
    name: `Surprise Allergy ${x}-${y}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Itchy Ooze (DOT X) */
export const itchyOoze = (x: number): NpcCommandDefinition => ({
    actions: `chain(deal(strength * .2), effect("poisoned", ${x}))`,
    id: `itchyOoze(${x})`,
    name: `Itchy Ooze ${x}`,
    targetNum: 1,
    targetType: 'enemies',
})
/** deal strength */
// export const chomp = (): NpcCommandDefinition => ({
//     actions: `deal(strength)`,
//     // actions: `ifDamageDealtExceeds(dot(1), 5, effect("poisoned",${x}))`,
//     id: `chomp`,
//     name: `Chomp`,
//     targetNum: 1,
//     targetType: 'enemies',
// })
/**Infectious Bite (DOT1, applies poison (X) if 5 or more damage goes unblocked) */
export const infectiousBite = (x: number): NpcCommandDefinition => ({
    actions: `ifDamageDealt(deal(strength), effect("poisoned", ${x})`,
    // actions: `ifDamageDealtExceeds(dot(1), 5, effect("poisoned",${x}))`,
    id: `infectiousBite(${x})`,
    name: `Infectious Bite ${x}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Engulf (deal X% of attack damage, applies Stun if any damage goes unblocked) */
export const engulf = (x: number): NpcCommandDefinition => ({
    actions: `ifDamageDealt(deal(strength*0.${x}), effect("stunned",1))`,
    id: `engulf(${x})`,
    name: `Engulf ${x}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Gnome bomb */
// export const gnomeBomb = (x: number): NpcCommandDefinition => ({
//     actions: `deal(strength * .3)`,
//     id: `gnomeBomb(${x})`,
//     name: `Gnome Bomb ${x}`,
//     targetNum: -1,
//     targetType: 'allEnemies',
// })
/**Meaty Charge (BA, applies bleed (X) if any damage goes unblocked) */
export const meatyCharge = (x: number): NpcCommandDefinition => ({
    actions: `ifDamageDealt(deal(strength), effect("bleed",${x}))`,
    id: `meatyCharge(${x})`,
    name: `Meaty Charge ${x}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Bellow and Sing, deal 50% of attack damage, applies fatigue (X) (applies debilatated (X) if any damage goes unblocked) */
export const bellowAndSing = (x: number, y: number): NpcCommandDefinition => ({
    actions: `ifDamageDealt(deal(strength/2), effect("debilitated",${y})); effect("fatigued",${x})`,
    id: `bellowAndSing(${x},${y})`,
    name: `Bellow and Sing ${x}-${y}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Scream and Charge (deal X% of attack damage, applies Unguarded (X) after) */
export const screamAndCharge = (
    x: number,
    y: number
): NpcCommandDefinition => ({
    actions: `deal(strength*0.${x}); effect("unguarded",${y})`,
    id: `screamAndCharge(${x},${y})`,
    name: `Scream and Charge ${x}-${y}`,
    targetNum: 1,
    targetType: 'enemies',
})
