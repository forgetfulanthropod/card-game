import type {
    BattleCursor,
    CalculatedCharacterStats,
    CharacterMeta,
    EffectFunc,
    EffectId,
} from 'shared'

import produce from 'immer'

export function calcPostEffectStats(cm: CharacterMeta) {
    const stats: CalculatedCharacterStats = {
        constitution: cm.constitution,
        dexterity: cm.dexterity,
        magic: cm.magic,
        strength: cm.strength,
        isSkipped: false,
        damageTakeMultiplier: 1,
        damageDealMultiplier: 1,
    }
    cm.effects.forEach(effect => {
        effectFuncs[effect.id](cm, stats, effect.counter)
    })
    return stats
}

const effectFuncs: Record<EffectId, EffectFunc> = {
    bleed(original, stats, counter) {
        // TODO: start of turn
    },
    debilitated(original, stats, counter) {
        stats.damageDealMultiplier *= 0.5
    },
    fatigue(original, stats, counter) {
        stats.damageDealMultiplier *= 0.25
    },
    poison(original, stats, counter) {
        // TODO: start of turn
    },
    stunned(original, stats, counter) {
        stats.isSkipped = true
    },
    unguarded(original, stats, counter) {
        stats.damageTakeMultiplier *= 1.25
    },
    vulnerable(original, stats, counter) {
        stats.damageTakeMultiplier *= 1.5
    },
}

/** bleed and poison happen at turn start */
export function applyTurnStartEffects(
    scene: BattleCursor,
    starting: 'pc' | 'npc'
) {
    const isPcStart = starting === 'pc'
    scene.select('allCharacters').apply(
        produce(ac => {
            for (const cm of Object.values(ac)) {
                if (cm.isPc !== isPcStart) continue

                const bleed = cm.effects.find(e => e.id === 'bleed')
                if (bleed) cm.health -= Math.floor(cm.constitution * 0.05)
                const poison = cm.effects.find(e => e.id === 'poison')
                if (poison) cm.health -= poison.counter
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
                cm.effects = cm.effects.filter(e => e.counter > 0)
            }
        })
    )
}
