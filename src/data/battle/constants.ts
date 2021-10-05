export const stanceTypeMetaMap: Record<StanceType, StanceTypeMeta> = {
    defensive: {
        id: 'defensive',
        attackMultiplier: .75,
        defenseMultiplier: .75,
        targetLikelihood: 0
    },
    neutral: {
        id: 'neutral',
        attackMultiplier: 1,
        defenseMultiplier: 1,
        targetLikelihood: 1
    },
    aggressive: {
        id: 'aggressive',
        attackMultiplier: 1.25,
        defenseMultiplier: 1.25,
        targetLikelihood: 2
    },
}

type MoveType = 'BA' | 'SL' | 'ROD1' | 'ROD2' | 'ROD3' | 'DOT1' | 'DOT2' | 'DOT3'
type MoveTypeMeta = {
    id: MoveType
    numTargets: number
    multiplier: number
    defaultSpriteUrl?: string
}

export const moveTypeMetaMap: Record<MoveType, MoveTypeMeta> = {
    BA: {
        id: 'BA',
        numTargets: 1,
        multiplier: .5,
    },
    SL: {
        id: 'SL',
        numTargets: 2,
        multiplier: .5,
    },
    DOT1: {
        id: 'DOT1',
        numTargets: 1,
        multiplier: 1.1,
    },
    DOT2: {
        id: 'DOT2',
        numTargets: 1,
        multiplier: 1.1,
    },
    DOT3: {
        id: 'DOT2',
        numTargets: 1,
        multiplier: 1.1,
    },
    ROD1: {
        id: 'ROD1',
        numTargets: 1,
        multiplier: 1.25,
    },
    ROD2: {
        id: 'ROD2',
        numTargets: 1,
        multiplier: 1.25,
    },
    ROD3: {
        id: 'ROD3',
        numTargets: 1,
        multiplier: 1.25,
    },
}

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

export const BASE_WIDTH = 1920
export const BASE_HEIGHT = 1080

export const X_AGGRESSIVE_THRESH = 11
export const X_NEUTRAL_THRESH = 9
