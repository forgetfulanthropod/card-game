import type {
    BattleCursor,
    CalculatedCharacterStats,
    CharacterMeta,
    EffectId,
    Effect,
    EnemyCharacterMeta,
    ModifiableStatName,
    StanceId,
} from 'shared'
import { turnEndClearEffects } from 'shared'
import {
    manageSideEffectsOfUnblockedDamage,
    applyCalcedDamage,
    recordDamage,
} from '../util/applyDamage'

import produce from 'immer'
import { getRulebook } from '@/rulebook'

const turnStartEffectIds = [
    'bleedDebuff',
    'poisonedDebuff',
    'passiveBlockBuff',
] as const
type TurnStartEffectId = typeof turnStartEffectIds[number]
type StaticEffectId = Exclude<EffectId, TurnStartEffectId>

const staticEffectFuncs: Record<
    StaticEffectId,
    (stats: CalculatedCharacterStats, counter: number) => void
> = {
    berserkBuff(stats) {
        if (stats.stance !== 'aggressive') return

        stats.damageDealMultiplicand += 0.5
        stats.damageTakeMultiplicand += 1
    },
    braveBuff(stats) {
        stats.damageDealMultiplicand += 0.15
    },
    courageousBuff(stats) {
        stats.damageDealMultiplicand += 0.25
    },
    debilitatedDebuff(stats) {
        stats.damageDealMultiplicand -= 0.5
    },
    doubleDamageBuff(stats) {
        stats.strength *= 2
    },
    chargedBombBuff(stats) {
        stats.strength *= 3
    },
    stampBuff(stats) {
        stats.strength += 30
    },
    entrancedBuff(stats, counter) {
        stats.magic += counter
    },
    fatiguedDebuff(stats) {
        stats.damageDealMultiplicand -= 0.25
    },
    guardedBuff(stats) {
        stats.damageTakeMultiplicand -= 0.25
    },
    reflectBuff(_) {},
    smallDamageIncreaseBuff(stats) {
        stats.damageTakeAddend += 4
    },
    strongblockBuff(stats) {
        stats.blockMultiplier += 0.5
    },
    stunnedDebuff(stats) {
        stats.isSkipped = true
    },
    targetedDebuff(stats) {
        stats.damageTakeAddend += 5
    },
    tiredDebuff(stats) {
        stats.damageDealMultiplicand -= 0.12
    },
    unguardedDebuff(stats) {
        stats.damageTakeMultiplicand += 0.25
    },
    unreadyDebuff(stats) {
        stats.damageTakeMultiplicand += 0.12
    },
    vulnerableDebuff(stats) {
        stats.damageTakeMultiplicand += 0.5
    },
}

// TODO standardize addBlock and applyDamage functions to be able to use here
// and cleanup this function
const turnStartEffectFuncs = (
    effect: Effect,
    character: CharacterMeta,
    scene: BattleCursor
) => {
    const effectId = effect.id as TurnStartEffectId
    if (effectId == 'passiveBlockBuff') {
        const block = Math.ceil(
            effect.counter * character.calculatedStats.blockMultiplier
        )
        character.block = Math.ceil(character.block + block)
        scene.apply('blocksAppliedThisTurn', blocks => [
            ...blocks,
            { amount: block, targetUid: character.uid },
        ])
    } else if (effectId === 'bleedDebuff' || effectId === 'poisonedDebuff') {
        // TODO: just use applyDamage function but avoid reflect calls
        // and attacker/attackerUid arguments. Currently does not check
        // highest damage hit scoring event.
        let calcedDamage = 0
        const targetUid = character.uid
        if (effectId === 'bleedDebuff')
            calcedDamage = Math.ceil(character.constitution * 0.05)
        else if (effectId === 'poisonedDebuff') calcedDamage = effect.counter
        else return
        const unblockedDamage = applyCalcedDamage({
            scene,
            calcedDamage,
            targetUid,
            piercing: true,
        })
        recordDamage(scene, calcedDamage, targetUid)
        manageSideEffectsOfUnblockedDamage(
            scene,
            character.uid,
            unblockedDamage
        )
    }
}

type CharacterMetaForCalculatingStats =
    | Omit<EnemyCharacterMeta, 'calculatedStats'>
    | Omit<CharacterMeta, 'calculatedStats'>

export function calculateStats(
    cm: CharacterMetaForCalculatingStats
): CalculatedCharacterStats {
    //@ts-expect-error
    const stance = cm.stance ?? 'neutral'

    const stats: CalculatedCharacterStats = {
        block: cm.block ?? 0,
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
        (cm.statModifiersMap?.turn?.[stat] ?? 0) +
        (cm.statModifiersMap?.room?.[stat] ?? 0) +
        (cm.statModifiersMap?.run?.[stat] ?? 0)
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
                if (character.isPc !== isPcSide || character.health <= 0)
                    continue
                character.effects.forEach(effect => {
                    turnStartEffectFuncs(effect, character, scene)
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
                // test all
                // cm.effects = [
                //     { id: 'berserk', counter: 2 },
                //     { id: 'bleed', counter: 2 },
                //     { id: 'brave', counter: 2 },
                //     { id: 'courageous', counter: 2 },
                //     { id: 'debilitated', counter: 2 },
                //     { id: 'fatigued', counter: 2 },
                //     { id: 'strongblock', counter: 2 },
                //     { id: 'entranced', counter: 2 },
                //     { id: 'poisoned', counter: 2 },
                //     { id: 'stunned', counter: 2 },
                //     { id: 'tired', counter: 2 },
                //     { id: 'unguarded', counter: 2 },
                //     { id: 'unready', counter: 2 },
                //     { id: 'vulnerable', counter: 2 },
                // ]
                cm.orbs = []
            })
        })
    )
}
