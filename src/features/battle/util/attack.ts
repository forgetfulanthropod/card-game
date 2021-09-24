import { stanceTypeMetaMap } from './constants'


// NPCs do not have stances
// PCs must have stances
export function getDamage(d: AttackData): number {
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


function getStanceTypeMeta(stance: StanceType | undefined) {
    if (stance == null) throw new Error('invalid stance!')

    return stanceTypeMetaMap[stance as StanceType]
}
