
import type { AttackData, CharacterMeta, CharacterMove, CharacterStats, CharacterUid, Effect, EffectType, StanceMultiplier, StanceName } from '@shared'

import { rulebook } from '@/rulebook'

import { getTransformed, isSpecial } from './specialMoves'


export function getCharacterMovesWithDamageRanges(character: CharacterStats & { stance: StanceName }): CharacterMove[] {
    return character.moves.map(move => {

        const damageRange = getMoveMultiplierRange(move).map(multiplier => {
            return character.damage * getAttackMultiplier(character) * multiplier
        })

        return {
            ...move,
            damageRange,
        }
    })
}

export function getCharacterKeysAndDamages(attackData: AttackData): { key: CharacterUid, damage: number }[] {
    const kds = attackData.defenders.map(defender => (
        { key: defender.uid, damage: getDamage(attackData, defender) }
    ))

    if (attackData.attacker.effects.length > 0) {
        attackData.attacker.effects.map(e => {
            if (e.damagesByRound == null || e.remainingRounds == null) { throw Error('bad attack effect data') }
            if (e.remainingRounds <= 0) { throw Error('trying to apply exhausted effect') }
            const damage = e.damagesByRound[e.damagesByRound.length - e.remainingRounds]
            kds.push({ key: attackData.attacker.uid, damage })
        })
    }

    return kds
}

export function getCharacterKeysAndEffects(attackData: AttackData): { key: CharacterUid, effect: Effect }[] {
    const moveTypeDOT = attackData.move.types.find(m => m.indexOf('DOT') > -1)
    if (moveTypeDOT != null) {
        const moveMeta = rulebook.moveMetaMap[moveTypeDOT]

        if (moveMeta.effectMultipliers == null) { throw Error('bad move meta') }
        const effectMultipliers = moveMeta.effectMultipliers
        return attackData.defenders.map(d => ({
            key: d.uid,
            effect: {
                type: moveTypeDOT as EffectType,
                remainingRounds: effectMultipliers.length - 1,
                damagesByRound: [...effectMultipliers.map(m => Math.max(1, attackData.attacker.damage * m * getDefenseMultiplier(d) | 0))],
            },
        }))
    }

    return []
}

function getDamage(ad: AttackData, defender: CharacterMeta): number {
    let attackData = ad
    if (isSpecial(ad.move)) attackData = { ...ad, move: getTransformed(ad.move, ad.attacker.uid) }

    const dam = Math.round(attackData.attacker.damage
        * getAttackMultiplier(attackData.attacker)
        * getMoveMultiplier(attackData)
        * getDefenseMultiplier(defender))

    return dam > 0 ? dam : 1
}


function getAttackMultiplier(attacker: Partial<CharacterMeta>): StanceMultiplier {
    return getStanceTypeMeta(attacker.stance).attackMultiplier
}

function getMoveMultiplier(d: AttackData): number {
    return d.move.types.reduce((multiplier, nextType) => {
        const typeMeta = rulebook.moveMetaMap[nextType]

        let typeMultiplier: number

        if (typeMeta.multipliers != null && Array.isArray(typeMeta.numTargets)) {
            const numDefenders = d.defenders.length
            const relevantMultiplierIndex = typeMeta.numTargets.findIndex(num => numDefenders <= num)
            if (relevantMultiplierIndex === -1) throw new Error('hmm something is deeply wrong')
            typeMultiplier = typeMeta.multipliers[relevantMultiplierIndex]
            logger.info('>>>>>>>>>>>>. hi set typeMultiplier via multipliers array..', typeMeta.multipliers)
        } else if (typeMeta.multiplier != null) {
            typeMultiplier = typeMeta.multiplier
        } else if (typeMeta.multiplierRange != null) {
            const r = typeMeta.multiplierRange
            typeMultiplier = r[0] + Math.random() * Math.abs(r[1] - r[0])
        } else {
            logger.info('><><><><><><><><>< UNIMPLEMENTED! ><><><><><><><><><')
            typeMultiplier = 1
        }

        // logger.info(JSON.stringify({ multiplier, typeMultiplier }))

        return multiplier * typeMultiplier
    }, 1)
}

function getMoveMultiplierRange(move: CharacterMove): [number] | [number, number] {
    // return [1,5]
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY

    move.types.forEach(type => {
        const moveMeta = rulebook.moveMetaMap[type]
        let multipliers
        if (moveMeta.multiplier != null)
            multipliers = [moveMeta.multiplier]
        else if (moveMeta.multipliers != null)
            multipliers = [...moveMeta.multipliers]
        else if (moveMeta.multiplierRange != null)
            multipliers = [...moveMeta.multiplierRange]
        else
            throw Error('movemeta has neither multiplier nor multipliers nor multiplierRange')

        multipliers.forEach(m => {
            if (m < min) min = m
            if (m > max) max = m
        })
    })

    if (min === max) return [min]

    return [Math.round(min), Math.round(max)]
}


function getDefenseMultiplier(defender: CharacterMeta): StanceMultiplier {
    return getStanceTypeMeta(defender.stance).defenseMultiplier
}

function getStanceTypeMeta(stance: StanceName | undefined) {
    if (stance == null) throw new Error('invalid stance!')
    const { stanceTypeMetaMap } = rulebook

    return stanceTypeMetaMap[stance as StanceName]
}
