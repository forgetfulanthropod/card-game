import type { CharacterMeta } from '@shared'

import { getCharacterMovesWithDamageRanges } from './attack'
import { applyBlessings } from './blessings'
import { newNPCMeta, newPCMeta } from './characterManagement'


export function getModified(prev: Readonly<CharacterMeta>): CharacterMeta {
    const clean = cleanMeta(prev)

    const blessed = applyBlessings(clean)
    const stanced = { ...blessed, moves: getCharacterMovesWithDamageRanges(blessed) }

    const final = copyFinalProperties(stanced, prev)

    return final
}

function cleanMeta(cm: Readonly<CharacterMeta>): CharacterMeta {
    const character = cm.isPc ? newPCMeta(cm) : newNPCMeta(cm)

    return {
        ...character,
        stance: cm.stance,
        effects: cm.effects,
    }
}

function copyFinalProperties(to: Readonly<CharacterMeta>, from: CharacterMeta): CharacterMeta {
    const deltaHealth = to.maxHealth - from.maxHealth
    const newHealth = Math.max(from.health + deltaHealth, 1)
    return {
        ...to,
        health: newHealth,
        hasMoved: from.hasMoved,
        experience: from.experience,
    }
}
