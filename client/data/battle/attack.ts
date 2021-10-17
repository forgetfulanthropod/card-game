
import { AttackData, CharacterMeta, StanceMultiplier, StanceName } from '../types'
import { stanceTypeMetaMap, moveModiferMap } from './constants'


// NPCs do not have stances
// PCs must have stances
export function getDamage(d: AttackData): number {

    console.log({ moveMultiplier: getMoveMultiplier(d) })

    const dam = d.attacker.damage
        * getAttackMultiplier(d.attacker)
        * getMoveMultiplier(d)
        * getDefenseMultiplier(d.defenders[0]) | 0

    return dam > 0 ? dam : 1
}


function getAttackMultiplier(attacker: CharacterMeta): StanceMultiplier {
    return getStanceTypeMeta(attacker.stance).attackMultiplier
}


function getMoveMultiplier(d: AttackData): number {
    return d.move.types.reduce((multiplier, nextType) => {
        // export interface MoveModifier {
        //     name: MoveModifierName
        //     numTargets: number | number[]
        //     multiplier: number | number[]
        //     defaultSpriteUrl?: string
        //     isSpecial?: boolean
        // }
        const typeMeta = moveModiferMap[nextType]

        let typeMultiplier: number

        if (Array.isArray(typeMeta.multiplier) && Array.isArray(typeMeta.numTargets)) {
            const numDefenders = d.defenders.length
            const relevantMultiplierIndex = typeMeta.numTargets.findIndex(num => numDefenders <= num)
            if (relevantMultiplierIndex === -1) throw new Error('hmm something is deeply wrong')
            typeMultiplier = typeMeta.multiplier[relevantMultiplierIndex]
        } else {
            typeMultiplier = typeMeta.multiplier as number
        }

        console.log(JSON.stringify({ multiplier, typeMultiplier }))

        return multiplier * typeMultiplier
    }, 1)
}


function getDefenseMultiplier(defender: CharacterMeta): StanceMultiplier {
    return getStanceTypeMeta(defender.stance).defenseMultiplier
}



function getMoveTypeMeta(move: MoveModifierName | undefined) {
    if (stance == null) throw new Error('invalid stance!')

    return moveModiferMap[stance as StanceName]
}

function getStanceTypeMeta(stance: StanceName | undefined) {
    if (stance == null) throw new Error('invalid stance!')

    return stanceTypeMetaMap[stance as StanceName]
}
