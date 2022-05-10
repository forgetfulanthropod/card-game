import type { AttackData, CharacterMeta, CharacterUid, Effect } from '@shared'
import type { SCursor } from 'sbaobab'
import { findIndex } from 'lodash'

import type { BattleCursor } from '@/util'

import {
    getCharacterKeysAndDamages,
    getCharacterKeysAndEffects,
} from './attack'
import { applyDamage } from './cards/cardActions/util/applyDamage'

/** Applies health, and effects */
export default function applyMove(
    scene: BattleCursor,
    attackData: AttackData
): void {
    const allChars = scene.select('allCharacters')

    markAttackerAsMoved(allChars, attackData)

    applyDamages(attackData, scene)

    decrementEffectStacks(allChars, attackData)
    applyNewEffects(allChars, attackData)
}

export type AllCharacters = SCursor<Record<CharacterUid, CharacterMeta>>

function markAttackerAsMoved(allChars: AllCharacters, attackData: AttackData) {
    allChars.select(attackData.attacker.uid).set('hasMoved', true)
}

function applyDamages(attackData: AttackData, scene: BattleCursor) {
    getCharacterKeysAndDamages(attackData, scene).forEach(
        ({ key: targetUid, damage }) => {
            applyDamage({ damage, targetUid, scene })
        }
    )
}

export function applyNewEffects(
    allChars: AllCharacters,
    attackData: AttackData
) {
    getCharacterKeysAndEffects(attackData).forEach(
        ({ key, effect: newEffect }) =>
            allChars
                .select(key)
                .apply('effects', prev => getUpdatedEffects(newEffect, prev))
    )
}

function decrementEffectStacks(
    allChars: AllCharacters,
    attackData: AttackData
) {
    allChars.select(attackData.attacker.uid).apply('effects', e => {
        return e
            .map(e => ({ ...e, remainingRounds: e.remainingRounds - 1 }))
            .filter(e => e.remainingRounds > 0)
    })
}

export function getUpdatedEffects(newEffect: Effect, prev: Effect[]): Effect[] {
    const prevTypeIndex = findIndex(prev, { type: newEffect.type }) // prev.findIndex(effect => effect.type === newEffect.type)
    if (prevTypeIndex > -1) {
        const prevEffect = prev[prevTypeIndex]
        const damagesByRound =
            prevEffect.damagesByRound != null &&
            newEffect.damagesByRound != null
                ? [
                      ...(prevEffect.damagesByRound ?? []),
                      ...(newEffect.damagesByRound ?? []),
                  ]
                : null
        const mergedEffect = {
            type: newEffect.type,
            remainingRounds:
                prevEffect.remainingRounds + newEffect.remainingRounds,
            ...(damagesByRound ? { damagesByRound } : {}),
        }
        return [
            ...prev.slice(0, prevTypeIndex),
            mergedEffect,
            ...prev.slice(prevTypeIndex + 1),
        ]
    }
    return [...prev, newEffect]
}
