import type {
    BattleCursor,
    CalculatedCharacterStats,
    CharacterMeta,
    EffectId,
    StanceId,
} from 'shared'
import { turnEndClearEffects } from 'shared'

import produce from 'immer'
import { getRulebook } from '@/rulebook'

const turnStartEffectIds = ['bleed', 'poison', 'passiveBlock'] as const
type TurnStartEffectId = typeof turnStartEffectIds[number]
type StaticEffectId = Exclude<EffectId, TurnStartEffectId>

const staticEffectFuncs: Record<
    StaticEffectId,
    (stats: CalculatedCharacterStats, counter: number) => void
> = {
    smallDamageIncrease(stats) {
        stats.damageTakeAddend += 4
    },
    trance(stats, counter) {
        stats.wisdom += Math.ceil(stats.wisdom * 0.11 * counter)
    },
    berserk(stats) {
        if (stats.stance !== 'aggressive') return

        stats.strength += Math.ceil(stats.strength * 0.5)
        stats.damageTakeMultiplicand *= 2
    },
    debilitated(stats) {
        stats.strength *= 0.5
    },
    fatigue(stats) {
        stats.strength *= 0.25
    },
    stunned(stats) {
        stats.isSkipped = true
    },
    strongblock(stats) {
        stats.blockMultiplier *= 1.5
    },
    unguarded(stats) {
        stats.damageTakeMultiplicand *= 1.25
    },
    vulnerable(stats) {
        stats.damageTakeMultiplicand *= 1.5
    },
    doubleDamage(stats) {
        stats.strength *= 2
    },
}

const turnStartEffectFuncs: Record<
    TurnStartEffectId,
    (cm: CharacterMeta, counter: number) => void
> = {
    bleed(cm) {
        cm.health -= Math.ceil(cm.constitution * 0.05)
    },
    poison(cm, counter) {
        cm.health -= counter
    },
    passiveBlock(cm, counter) {
        cm.block += counter
    },
} as const

/** pure function */
export function calcPostEffectStats(cm: CharacterMeta) {
    const stats: CalculatedCharacterStats = {
        block: cm.block,
        blockMultiplier: 1,
        constitution: cm.constitution,
        defense: cm.defense,
        wisdom: cm.wisdom,
        strength: cm.strength,
        isSkipped: false,
        damageDealMultiplicand: getDamageDealMulitplicandForStance(cm.stance),
        damageDealAddend: 0,
        damageTakeMultiplicand: getDamageTakeMulitplicandForStance(cm.stance),
        damageTakeAddend: 0,
        health: cm.health,
        stance: cm.stance,
    }

    cm.effects?.forEach(effect => {
        if (turnStartEffectIds.includes(effect.id as TurnStartEffectId)) return
        staticEffectFuncs[effect.id as StaticEffectId]?.(stats, effect.counter)
    })

    return stats
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
    nextTurn: 'pc' | 'npc'
) {
    const isPcStart = nextTurn === 'pc'
    scene.select('allCharacters').apply(
        produce(allCharacters => {
            for (const character of Object.values(allCharacters)) {
                if (character.isPc === isPcStart) continue
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
                cm.effects = []
                cm.orbs = []
            })
        })
    )
}
