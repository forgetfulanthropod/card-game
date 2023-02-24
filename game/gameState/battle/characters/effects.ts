import type {
    BattleCursor,
    CalculatedCharacterStats,
    CharacterMeta,
    Effect,
    EffectId,
    EnemyCharacterMeta,
    ModifiableStatName,
    StanceId,
} from 'shared'
import { turnEndClearEffects } from 'shared'
import { applyDamage } from '../util/applyDamage'

import { getRulebook } from '@/rulebook'
import produce from 'immer'
import { applyBlocks } from '../cards/commands/addBlock'
import { applyEffect } from '../cards/commands/effect'
import { getLivingNpcUids, getLivingPcUids } from './characterGetters'

const turnStartEffectIds = [
    'bleedDebuff',
    'poisonedDebuff',
    'passiveBlockBuff',
    'fireDebuff',
    'yodelBuff',
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
    cowardsCrown(stats) {
        if (stats.stance === 'avoidant') stats.damageDealMultiplicand += 0.15
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
    ignoreAggressive(stats) {
        if (stats.stance !== 'aggressive') return

        stats.damageTakeMultiplicand -=
            getDamageTakeMulitplicandForStance('aggressive') - 1

        stats.damageDealMultiplicand -=
            getDamageDealMulitplicandForStance('aggressive') - 1
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

const turnStartEffectFuncs: Record<
    TurnStartEffectId,
    ({
        effect,
        character,
        scene,
    }: {
        effect: Effect
        character: CharacterMeta
        scene: BattleCursor
    }) => void
> = {
    passiveBlockBuff({ effect, character, scene }) {
        const block = Math.ceil(
            effect.counter * character.calculatedStats.blockMultiplier
        )

        applyBlocks({ targetUids: [character.uid], block, scene })
    },
    bleedDebuff({ character, scene }) {
        applyDamage({
            damage: Math.ceil(character.calculatedStats.constitution * 0.05),
            targetUid: character.uid,
            scene,
            piercing: true,
        })
    },
    poisonedDebuff({ effect, character, scene }) {
        applyDamage({
            damage: effect.counter,
            targetUid: character.uid,
            scene,
            piercing: true,
        })
    },
    fireDebuff({ character, scene }) {
        applyEffect(scene, [character.uid], 'vulnerableDebuff', 2)
    },
    yodelBuff({ character, scene }) {
        applyEffect(
            scene,
            !character.isPc // weird thing.. invisible on player side..
                ? getLivingPcUids(scene.get())
                : getLivingNpcUids(scene.get()),
            'braveBuff',
            1
        )
    },
}

const activateTurnStartEffect = (
    effect: Effect,
    character: CharacterMeta,
    scene: BattleCursor
) => {
    const effectFunc = turnStartEffectFuncs?.[effect.id as TurnStartEffectId]
    if (!effectFunc || character.health <= 0) {
        return
    }

    effectFunc({
        effect,
        character,
        scene,
    })
}

type CharacterMetaForCalculatingStats =
    | Omit<EnemyCharacterMeta, 'calculatedStats'>
    | Omit<CharacterMeta, 'calculatedStats'>

export function calculateStats(
    cm: CharacterMetaForCalculatingStats
): CalculatedCharacterStats {
    //@ts-expect-error
    const stance = cm.stance ?? 'neutral'

    const constitution =
        cm.constitution + getStatModifierAddend(cm, 'constitution')

    const stats: CalculatedCharacterStats = {
        block: cm.block ?? 0,
        blockMultiplier: 1,
        constitution,
        defense: cm.defense + getStatModifierAddend(cm, 'defense'),
        magic: cm.magic + getStatModifierAddend(cm, 'magic'),
        strength: cm.strength + getStatModifierAddend(cm, 'strength'),
        isSkipped: false,
        damageDealMultiplicand: getDamageDealMulitplicandForStance(stance),
        damageDealAddend: 0,
        damageTakeMultiplicand: getDamageTakeMulitplicandForStance(stance),
        damageTakeAddend: 0,
        health: Math.min(cm.health, constitution),
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
    scene.select('allCharacters').apply(
        produce(allCharacters => {
            for (const character of Object.values(allCharacters)) {
                if (character.isPc && whichSide === 'npc') continue
                if (!character.isPc && whichSide === 'pc') continue
                if (character.health <= 0) continue
                character.effects.forEach(effect => {
                    activateTurnStartEffect(effect, character, scene)
                })
            }
        })
    )
    decrementTurnStartEffects(scene, whichSide)
}

export function decrementTurnStartEffects(
    scene: BattleCursor,
    whichSide: 'pc' | 'npc'
) {
    decrementEffects(scene, whichSide, true)
}

export function decrementEffects(
    scene: BattleCursor,
    whichSide: 'pc' | 'npc',
    turnStart = false
) {
    scene.select('allCharacters').apply(
        produce(ac => {
            for (const cm of Object.values(ac)) {
                if (cm.isPc && whichSide === 'npc') continue
                if (!cm.isPc && whichSide === 'pc') continue
                cm.effects.forEach(e => {
                    //@ts-expect-error
                    if (turnStart === turnStartEffectIds.includes(e.id))
                        e.counter -= 1
                })
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
