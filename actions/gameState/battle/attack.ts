
import type { AttackData, CharacterMeta, CharacterUid, StanceMultiplier, StanceName } from '@shared/index'

import { rulebook } from '../../rulebook'

export function getCharacterKeysAndDamages(attackData: AttackData): { key: CharacterUid, damage: number }[] {
    return attackData.defenders.map(defender => (
        { key: defender.uid, damage: getDamage(attackData) }
    ))
}

function getDamage(d: AttackData): number {
    if (d.attacker.isPc)
        return getAttackMultiplier(d.attacker) * d.attacker.damage | 0

    const dam = d.attacker.damage
        * getAttackMultiplier(d.attacker)
        * getMoveMultiplier(d)
        * getDefenseMultiplier(d.defenders[0]) | 0

    return dam > 0 ? dam : 1
}


function getAttackMultiplier(attacker: CharacterMeta): StanceMultiplier {
    return getStanceTypeMeta(attacker.stance).attackMultiplier
}


// export interface MoveModifier {
//     name: MoveModifierName
//     numTargets: number | number[]
//     multiplier: number | number[]
//     defaultSpriteUrl?: string
//     isSpecial?: boolean
// }
function getMoveMultiplier(d: AttackData): number {
    return d.move.types.reduce((multiplier, nextType) => {
        const typeMeta = rulebook.moveModiferMap[nextType]

        let typeMultiplier: number

        if (typeMeta.multipliers != null && Array.isArray(typeMeta.numTargets)) {
            const numDefenders = d.defenders.length
            const relevantMultiplierIndex = typeMeta.numTargets.findIndex(num => numDefenders <= num)
            if (relevantMultiplierIndex === -1) throw new Error('hmm something is deeply wrong')
            typeMultiplier = typeMeta.multipliers[relevantMultiplierIndex]
        } else {
            typeMultiplier = typeMeta.multiplier as number
        }

        // console.log(JSON.stringify({ multiplier, typeMultiplier }))

        return multiplier * typeMultiplier
    }, 1)
}


function getDefenseMultiplier(defender: CharacterMeta): StanceMultiplier {
    return getStanceTypeMeta(defender.stance).defenseMultiplier
}

function getStanceTypeMeta(stance: StanceName | undefined) {
    if (stance == null) throw new Error('invalid stance!')
    const { stanceTypeMetaMap } = rulebook

    return stanceTypeMetaMap[stance as StanceName]
}
