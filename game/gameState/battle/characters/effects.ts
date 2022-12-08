import type {
    BattleCursor,
    CalculatedCharacterStats,
    CharacterMeta,
    EffectId,
    EnemyCharacterMeta,
    ModifiableStatName,
    StanceId,
} from 'shared'
import { turnEndClearEffects } from 'shared'

import produce from 'immer'
import { getRulebook } from '@/rulebook'

const turnStartEffectIds = ['bleed', 'poisoned', 'passiveBlock'] as const
type TurnStartEffectId = typeof turnStartEffectIds[number]
type StaticEffectId = Exclude<EffectId, TurnStartEffectId>

const staticEffectFuncs: Record<
    StaticEffectId,
    (stats: CalculatedCharacterStats, counter: number) => void
> = {
    berserk(stats) {
        if (stats.stance !== 'aggressive') return

        stats.strength += Math.ceil(stats.strength * 0.5)
        stats.damageTakeMultiplicand *= 2
    },
    courageous(stats) {
        stats.damageDealMultiplicand *= 1.15
    },
    debilitated(stats) {
        stats.damageDealMultiplicand *= 0.5
    },
    doubleDamage(stats) {
        stats.strength *= 2
    },
    emboldened(stats) {
        stats.damageDealMultiplicand *= 1.25
    },
    entranced(stats, counter) {
        stats.magic += counter
    },
    fatigued(stats) {
        stats.damageDealMultiplicand *= 0.75
    },
    smallDamageIncrease(stats) {
        stats.damageTakeAddend += 4
    },
    strongblock(stats) {
        stats.blockMultiplier *= 1.5
    },
    stunned(stats) {
        stats.isSkipped = true
    },
    tired(stats) {
        stats.damageDealMultiplicand *= 0.88
    },
    unguarded(stats) {
        stats.damageTakeMultiplicand *= 1.25
    },
    vulnerable(stats) {
        stats.damageTakeMultiplicand *= 1.5
    },
}

const turnStartEffectFuncs: Record<
    TurnStartEffectId,
    (cm: CharacterMeta, counter: number) => void
> = {
    bleed(cm) {
        cm.health -= Math.ceil(cm.constitution * 0.05)
    },
    poisoned(cm, counter) {
        cm.health -= counter
    },
    passiveBlock(cm, counter) {
        cm.block += counter
    },
} as const

type CharacterMetaForCalculatingStats =
    | Omit<EnemyCharacterMeta, 'calculatedStats'>
    | Omit<CharacterMeta, 'calculatedStats'>

export function calculateStats(
    cm: CharacterMetaForCalculatingStats
): CalculatedCharacterStats {
    //@ts-expect-error
    const stance = cm.stance ?? 'neutral'

    const stats: CalculatedCharacterStats = {
        block: cm.block,
        blockMultiplier: 1,
        constitution:
            cm.constitution + getStatModifierAddend(cm, 'constitution'),
        defense: cm.defense + getStatModifierAddend(cm, 'defense'),
        magic: cm.magic + getStatModifierAddend(cm, 'magic'),
        strength: cm.strength + getStatModifierAddend(cm, 'strength'),
        isSkipped: false,
        damageDealMultiplicand: getDamageDealMulitplicandForStance(stance),
        damageDealAddend: 0,
        damageTakeMultiplicand: getDamageTakeMulitplicandForStance(stance),
        damageTakeAddend: 0,
        health: cm.health,
        stance,
    }

    cm.effects?.forEach(effect => {
        if (turnStartEffectIds.includes(effect.id as TurnStartEffectId)) return
        staticEffectFuncs[effect.id as StaticEffectId]?.(stats, effect.counter)
    })

    return stats
}

function getStatModifierAddend(
    cm: CharacterMetaForCalculatingStats,
    stat: ModifiableStatName
): number {
    return (
        (cm.statModifiersMap?.turn[stat] ?? 0) +
        (cm.statModifiersMap?.room[stat] ?? 0) +
        (cm.statModifiersMap?.run[stat] ?? 0)
    )
}

function getDamageDealMulitplicandForStance(stance: StanceId) {
    const stanceMeta = getRulebook().stanceTypeMetaMap[stance]
    return stanceMeta ? stanceMeta.attackMultiplier : 1
}

function getDamageTakeMulitplicandForStance(stance: StanceId) {
    const stanceMeta = getRulebook().stanceTypeMetaMap[stance]
    return stanceMeta ? stanceMeta.defenseMultiplier : 1
}

export function applyTurnStartEffects(
    scene: BattleCursor,
    whichSide: 'pc' | 'npc'
) {
    const isPcSide = whichSide === 'pc'
    scene.select('allCharacters').apply(
        produce(allCharacters => {
            for (const character of Object.values(allCharacters)) {
                if (character.isPc !== isPcSide) continue
                character.effects.forEach(effect => {
                    turnStartEffectFuncs[effect.id as TurnStartEffectId]?.(
                        character,
                        effect.counter
                    )
                })
            }
        })
    )
}

export function decrementEffects(scene: BattleCursor, finished: 'pc' | 'npc') {
    const isPcStart = finished === 'pc'
    scene.select('allCharacters').apply(
        produce(ac => {
            for (const cm of Object.values(ac)) {
                if (cm.isPc !== isPcStart) continue
                cm.effects.forEach(e => (e.counter -= 1))
                cm.effects = cm.effects.filter(
                    e => e.counter > 0 && !turnEndClearEffects.includes(e.id)
                )
            }
        })
    )
}

export function clearAllEffects(scene: BattleCursor): void {
    scene.apply(
        'allCharacters',
        produce(ac => {
            Object.values(ac).forEach(cm => {
                cm.block = 0
                cm.effects = []
                cm.orbs = []
            })
        })
    )
}
