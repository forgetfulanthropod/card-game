import type { CharacterMeta } from '@shared'

import { newNPCMeta, newPCMeta } from '.'
import { getCharacterMovesWithDamageRanges } from './attack'
import { applyBlessings } from './blessings'

/** Returns updated blessing. Does not modify in place! (i.e. pure function) (That's the goal at least.) */


export function getModified(prev: Readonly<CharacterMeta>): CharacterMeta {
    // TODO: should probably make brand new info from stance + a key in the statsMap
    const clean = cleanMetaFromStats(prev)

    const blessed = applyBlessings(clean)
    const stanced = { ...blessed, moves: getCharacterMovesWithDamageRanges(blessed) }

    const final = copyDynamicProperties(stanced, prev)

    return final
}

function cleanMetaFromStats(cm: Readonly<CharacterMeta>): CharacterMeta {
    return cm.isPc ? newPCMeta(cm) : newNPCMeta(cm)
}

function copyDynamicProperties(to: Readonly<CharacterMeta>, from: CharacterMeta): CharacterMeta {
    const deltaHealth = to.maxHealth - from.maxHealth
    const newHealth = Math.max(from.health + deltaHealth, 1)
    return {
        ...to,
        effects: from.effects,
        stance: from.stance,
        health: newHealth,
        hasMoved: from.hasMoved,
        experience: from.experience,
    }
}
