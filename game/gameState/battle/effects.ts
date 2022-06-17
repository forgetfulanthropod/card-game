import type {
    BattleCursor,
    CalculatedCharacterStats,
    CharacterMeta,
    EffectId,
} from 'shared'
import { turnEndClearEffects } from 'shared'

import produce from 'immer'

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
    // strengthify(stats, counter) {
    //     stats.strength += counter
    // },
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
        stats.damageTakeMultiplier *= 1.25
    },
    vulnerable(stats) {
        stats.damageTakeMultiplier *= 1.5
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
        cm.health -= Math.floor(cm.constitution * 0.05)
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
        damageTakeMultiplier: 1,
        damageTakeAddend: 0,
        health: cm.health,
    }
    cm.effects?.forEach(effect => {
        if (turnStartEffectIds.includes(effect.id as TurnStartEffectId)) return
        staticEffectFuncs[effect.id as StaticEffectId](stats, effect.counter)
    })
    return stats
}

export function applyTurnStartEffects(
    scene: BattleCursor,
    starting: 'pc' | 'npc'
) {
    const isPcStart = starting === 'pc'
    scene.select('allCharacters').apply(
        produce(ac => {
            for (const cm of Object.values(ac)) {
                if (cm.isPc !== isPcStart) continue
                cm.effects.forEach(eff =>
                    turnStartEffectFuncs[eff.id as TurnStartEffectId]?.(
                        cm,
                        eff.counter
                    )
                )
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
