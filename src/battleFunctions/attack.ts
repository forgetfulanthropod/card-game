import { stanceTypeMetaMap } from './battleConstants'


// NPCs do not have stances
// PCs must have stances
export function getDamage(d: AttackData): number {
    if (d.attacker.isPlayerCharacter)
        return getAttackMultiplier(d.attacker) * d.attacker.damage | 0

    return d.attacker.damage * getDefenseMultiplier(d.defender) | 0
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
