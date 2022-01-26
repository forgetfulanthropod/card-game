import type { AttackData, CharacterMeta, CharacterUid, Effect } from '@shared'
import type { SCursor } from 'baobab'
import { findIndex } from 'lodash'

import type { BattleCursor } from '@/util'

import {
    getCharacterKeysAndDamages,
    getCharacterKeysAndEffects,
} from './attack'

/** Applies health, and effects */
export default function applyMove(
    scene: BattleCursor,
    lastAllChars: Record<string, CharacterMeta>,
    attackData: AttackData,
    username: string
): void {
    const allChars = scene.select('allCharacters')

    markAttackerAsMoved(allChars, attackData)

    applyDamages(attackData, username, lastAllChars, allChars)

    decrementEffectStacks(allChars, attackData)
    applyNewEffects(allChars, attackData)
}

export type AllCharacters = SCursor<Record<CharacterUid, CharacterMeta>>

function markAttackerAsMoved(allChars: AllCharacters, attackData: AttackData) {
    allChars.select(attackData.attacker.uid).set('hasMoved', true)
}

function applyDamages(
    attackData: AttackData,
    username: string,
    lastAllChars: Record<string, CharacterMeta>,
    allChars: AllCharacters
) {
    getCharacterKeysAndDamages(attackData, username).forEach(
        ({ key, damage }) => {
            const newHealth = lastAllChars[key].health - damage
            allChars.select(key).set('health', newHealth)
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
                .apply('effects', prev => updateEffect(newEffect, prev))
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

function updateEffect(newEffect: Effect, prev: Effect[]): Effect[] {
    const prevTypeIndex = findIndex(prev, { type: newEffect.type }) // prev.findIndex(effect => effect.type === newEffect.type)
    if (prevTypeIndex > -1) {
        const prevEffect = prev[prevTypeIndex]
        const damagesByRound = [
            ...(prevEffect.damagesByRound ?? []),
            ...(newEffect.damagesByRound ?? []),
        ]
        const mergedEffect = {
            type: newEffect.type,
            remainingRounds:
                prevEffect.remainingRounds + newEffect.remainingRounds,
            damagesByRound,
        }
        return [
            ...prev.slice(0, prevTypeIndex),
            mergedEffect,
            ...prev.slice(prevTypeIndex + 1),
        ]
    }
    return [...prev, newEffect]
}
