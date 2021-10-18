

// import { getRulebook } from '../rootTree'
import type { AttackData, CharacterMeta, StanceMultiplier, StanceName } from '@shared/battleTypes'
import { rulebook } from './rulebook'

// NPCs do not have stances
// PCs must have stances
export function getCharacterKeysAndDamages(attackData) {
    return attackData.defenders.map(defender => (
        { key: defender.uid, damage: getDamage(attackData) }
    ))
}

function getDamage(d: AttackData): number {
    if (d.attacker.isPc)
        return getAttackMultiplier(d.attacker) * d.attacker.damage | 0

    return d.attacker.damage * getDefenseMultiplier(d.defenders[0]) | 0
}


function getAttackMultiplier(attacker: CharacterMeta): StanceMultiplier {
    return getStanceTypeMeta(attacker.stance).attackMultiplier
}


function getDefenseMultiplier(defender: CharacterMeta): StanceMultiplier {
    return getStanceTypeMeta(defender.stance).defenseMultiplier
}


function getStanceTypeMeta(stance: StanceName | undefined) {
    if (stance == null) throw new Error('invalid stance!')
    const { stanceTypeMetaMap } = rulebook

    return stanceTypeMetaMap[stance as StanceName]
}
