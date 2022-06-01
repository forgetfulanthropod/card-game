import type { CommandDefinition } from 'shared'

/**Startling Spook (Applies Unguarded x, Fatigue x) */
export const startlingSpook = (x: number, y: number): CommandDefinition => ({
    actions: `effect("unguarded",${x}); effect("fatigue",${y})`,
    id: `startlingSpook(${x},${y})`,
    name: `Startling Spook ${x}-${y}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Surprise Allergy (Deals 50% of attack damage, applies Poison X if unblocked, Fatigue X) */
export const surpriseAllergy = (x: number, y: number): CommandDefinition => ({
    actions: `deal(strength/2); ifDamageDealt(effect("poison",${x}), effect("fatigue",${y}))`,
    id: `surpriseAllergy(${x},${y})`,
    name: `Surprise Allergy ${x}-${y}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Itchy Ooze (DOT X) */
export const itchyOoze = (x: number): CommandDefinition => ({
    actions: `dot(${x})`,
    id: `itchyOoze(${x})`,
    name: `Itchy Ooze ${x}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Infectious Bite (DOT1, applies poison (X) if 5 or more damage goes unblocked) */
export const infectiousBite = (x: number): CommandDefinition => ({
    actions: `dot(1); ifDamageDealtExceeds(5, effect("poison",${x}))`,
    id: `infectiousBite(${x})`,
    name: `Infectious Bite ${x}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Engulf (Deals X% of attack damage, applies Stun if any damage goes unblocked) */
export const engulf = (x: number): CommandDefinition => ({
    actions: `deal(strength*0.${x}); ifDamageDealt(effect("stun",1))`,
    id: `engulf(${x})`,
    name: `Engulf ${x}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Meaty Charge (BA, applies bleed (X) if any damage goes unblocked) */
export const meatyCharge = (x: number): CommandDefinition => ({
    actions: `deal(strength); ifDamageDealt(effect("bleed",${x}))`,
    id: `meatyCharge(${x})`,
    name: `Meaty Charge ${x}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Bellow and Sing, deals 50% of attack damage, applies fatigue (X) (applies debilatated (X) if any damage goes unblocked) */
export const bellowAndSing = (x: number, y: number): CommandDefinition => ({
    actions: `deal(strength/2); effect("fatigue",${x}); ifDamageDealt(effect("debilatated",${y}))`,
    id: `bellowAndSing(${x},${y})`,
    name: `Bellow and Sing ${x}-${y}`,
    targetNum: 1,
    targetType: 'enemies',
})
/**Scream and Charge (Deals X% of attack damage, applies Unguarded (X) after) */
export const screamAndCharge = (x: number, y: number): CommandDefinition => ({
    actions: `deal(strength*0.${x}); effect("unguarded",${y})`,
    id: `screamAndCharge(${x},${y})`,
    name: `Scream and Charge ${x}-${y}`,
    targetNum: 1,
    targetType: 'enemies',
})
