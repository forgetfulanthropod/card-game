import type {
    BattleCursor,
    CalculatedCharacterStats,
    CharacterMeta,
    EffectId,
} from 'shared'
import { turnEndClearEffects } from 'shared'

import produce from 'immer'

export function calcPostEffectStats(cm: CharacterMeta) {
    const stats: CalculatedCharacterStats = {
        block: cm.block,
        blockMultiplier: 1,
        constitution: cm.constitution,
        dexterity: cm.dexterity,
        wisdom: cm.wisdom,
        strength: cm.strength,
        isSkipped: false,
        damageTakeMultiplier: 1,
    }
    cm.effects.forEach(effect => {
        effectFuncs[effect.id](stats)
    })
    return stats
}

const effectFuncs: Record<EffectId, (stats: CalculatedCharacterStats) => void> =
    {
        /** see applyTurnStartEffects */
        bleed(_stats) {},
        debilitated(stats) {
            stats.strength *= 0.5
        },
        fatigue(stats) {
            stats.strength *= 0.25
        },
        /** see applyTurnStartEffects */
        poison(_stats) {},
        stunned(stats) {
            stats.isSkipped = true
        },
        tetsudo(stats) {
            stats.blockMultiplier *= 1.5
        },
        unguarded(stats) {
            stats.damageTakeMultiplier *= 1.25
        },
        vulnerable(stats) {
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
