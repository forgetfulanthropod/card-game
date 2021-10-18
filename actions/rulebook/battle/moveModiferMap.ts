// import { deepFreeze } from '@/util'
import type { MoveModifier, MoveModifierName } from '@shared/index'


// Basic Attack: 100% of attack damage, no modifiers
// Slash: 50% of attack damage, affects up to one adjacent target (rounded up at .5 or greater, down otherwise)
// DOT 1: Deals 50% of attack damage.  Does 33% for three subsequent turns as well.  (subsequent damage is inflicted before that character activates.  This is not modified by RNG)
// DOT 2: Deals 50% of attack damage.  Does 25% for four subsequent turns as well (subsequent damage is inflicted before that character activates.  This is not modified by RNG).
// Random Damage 1: Deals 25% more to 25% less damage randomly
// Random Damage 2: Deals 33% more to 33% less damage randomly
// Random Damage 3: Deals 50% more to 50% less damage randomly
// Splash: Deals 33% of damage (rounded up at .5 or greater, down otherwise), affects up to 2 adjacent targets.  If only two targets are present, it does 40% damage to both.
// Heal: Heals target for 75% of attack damage.
// Life steal: Deals 50% of attack damage.  Heals for 25%.
// Stable: No ⅓ Modifier
// Block: Reduce all damage received this round by this kaiju’s attack characteristic to a minimum of 1 (no rng).  If the combined attack value of enemies attacking this kaiju exceeds this kaiju’s attack characteristic during the round, excess damage is taken as normal.
// Debuff 1: Reduce the attack characteristic of an enemy by 100% of this kaiju’s attack characteristic, to a minimum of 1, for the remainder of the round.
// Debuff 2: Deal 50% of attack damage.  Reduce the target’s attack damage by 50% of your attack damage (to a minimum of 1) until the end of the round.  If this has a splash or slash modifier, split both the 50% damage reduction and damage inflicted from this attack between all targets evenly.

// The potential damage range of each character’s attack should always be displayed.  For example, if a character has 10 attack and does a basic attack, it should show the potential damage as 9-11, not 10.

// DOT effects applied by multiple characters can stack, but a character cannot stack DOT with itself.

// TODO: fill in this data

export const moveModiferMap: Record<MoveModifierName, MoveModifier> = {
    BA: {
        name: 'BA',
        numTargets: 1,
        multiplier: .5,
    },
    SL: {
        name: 'SL',
        numTargets: 2,
        multiplier: .5,
    },
    SP: {
        name: 'SP',
        numTargets: 2,
        multiplier: .5,
    },
    DOT1: {
        name: 'DOT1',
        numTargets: 1,
        multiplier: 1.1,
    },
    DOT2: {
        name: 'DOT2',
        numTargets: 1,
        multiplier: 1.1,
    },
    DOT3: {
        name: 'DOT2',
        numTargets: 1,
        multiplier: 1.1,
    },
    ROD1: {
        name: 'ROD1',
        numTargets: 1,
        multiplier: 1.25,
    },
    ROD2: {
        name: 'ROD2',
        numTargets: 1,
        multiplier: 1.25,
    },
    ROD3: {
        name: 'ROD3',
        numTargets: 1,
        multiplier: 1.25,
    },
    ST: {
        name: 'ST',
        numTargets: 1,
        multiplier: 1,
        isSpecial: true,
    },
    INHSO: {//TODO: heals for +1 per target
        name: 'INHSO',
        numTargets: 2,
        multiplier: 1,
        isSpecial: true,
    },
    DC4A: {//TODO: subtract health of a friendly kaiju equal to damage: give 1.5x that health to the lich lord
        name: 'DC4A',
        numTargets: 1,
        multiplier: 1,
        isSpecial: true,
    },
    MIM: {
        name: 'MIM',
        numTargets: 1,
        multiplier: 1,
        isSpecial: true,
    }
}
