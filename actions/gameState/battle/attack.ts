
import type { AttackData, CharacterMeta, CharacterUid, Effect, EffectType, StanceMultiplier, StanceName } from '@shared/index'

import { rulebook } from '../../rulebook'

export function getCharacterKeysAndDamages(attackData: AttackData): { key: CharacterUid, damage: number }[] {
    const kds = attackData.defenders.map(defender => (
        { key: defender.uid, damage: getDamage(attackData) }
    ))

    if (attackData.attacker.effects.length > 0) {
        attackData.attacker.effects.map(e => {
            if (e.damagesByRound == null || e.remainingRounds == null) { throw Error('bad attack effect data') }
            const damage = e.damagesByRound[e.damagesByRound.length - e.remainingRounds]
            kds.push({ key: attackData.attacker.uid, damage })
        })
    }

    return kds
}

// export interface Effect {
//     type?: EffectType
//     remainingRounds?: number
//     damagesByRound?: number[]
//     dealer?: CharacterMeta
// }
export function getCharacterKeysAndEffects(attackData: AttackData): { key: CharacterUid, effect: Effect }[] {
    const moveTypeDOT = attackData.move.types.find(m => m.indexOf('DOT') > -1)
    if (moveTypeDOT != null) {
        const moveMeta = rulebook.moveModiferMap[moveTypeDOT]

        if (moveMeta.effectMultipliers === undefined) { throw Error('bad move meta') }
        return attackData.defenders.map(d => ({
            key: d.uid,
            effect: {
                type: moveTypeDOT as EffectType,
                remainingRounds: moveMeta.effectMultipliers!.length - 1,
                damagesByRound: [
                    ...moveMeta.effectMultipliers!.map(m => Math.max(1, attackData.attacker.damage * m * getDefenseMultiplier(d) | 0))
                ]
            }
        }))
    }

    return []
}

function getDamage(d: AttackData): number {
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
            console.log('>>>>>>>>>>>>. hi set typeMultiplier via multipliers array..', typeMeta.multipliers)
        } else if (typeMeta.multiplier != null) {
            typeMultiplier = typeMeta.multiplier
        } else if (typeMeta.multiplierRange != null) {
            const r = typeMeta.multiplierRange
            typeMultiplier = r[0] + Math.random() * Math.abs(r[1] - r[0])
        } else {
            console.log('><><><><><><><><>< UNIMPLEMENTED! ><><><><><><><><><')
            typeMultiplier = 1
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
