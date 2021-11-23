
import type { AttackData, CharacterMeta, Effect } from '@shared'
import { findIndex } from 'lodash'

import type { BattleCursor } from '@/util'
import { commit } from '@/util'

import { getCharacterKeysAndDamages, getCharacterKeysAndEffects } from './attack'


/** Applies hasmoved, health, and effects */
export default function applyMove(scene: BattleCursor, lastAllChars: Record<string, CharacterMeta>, attackData: AttackData, username: string): void {
    const allChars = scene.select('allCharacters')

    allChars.select(attackData.attacker.uid).set('hasMoved', true)
    getCharacterKeysAndDamages(attackData, username).forEach(({ key, damage }) => {
        const newHealth = lastAllChars[key].health - damage
        allChars.select(key).set('health', newHealth)
    })
    allChars.select(attackData.attacker.uid).apply('effects', e => {
        return e
            .map(e => ({ ...e, remainingRounds: e.remainingRounds - 1 }))
            .filter(e => e.remainingRounds > 0)
    })
    // reduce remaining rounds, clear exhausted effects
    getCharacterKeysAndEffects(attackData).forEach(({ key, effect: newEffect }) =>
        allChars.select(key).apply('effects', prev => updateEffect(newEffect, prev))
    )
    commit(scene, username)
}

function updateEffect(newEffect: Effect, prev: Effect[]): Effect[] {
    const prevTypeIndex = findIndex(prev, { type: newEffect.type }) // prev.findIndex(effect => effect.type === newEffect.type)
    if (prevTypeIndex > -1) {
        const prevEffect = prev[prevTypeIndex]
        const mergedEffect = {
            type: newEffect.type,
            remainingRounds: prevEffect.remainingRounds + newEffect.remainingRounds,
            damagesByRound: [...prevEffect.damagesByRound, ...newEffect.damagesByRound],
        }
        return [...prev.slice(0, prevTypeIndex), mergedEffect, ...prev.slice(prevTypeIndex + 1)]
    }
    return [...prev, newEffect]
}
