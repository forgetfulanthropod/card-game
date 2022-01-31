import type {
    AttackData,
    Card,
    CharacterMeta,
    CharacterMove,
    CharacterUid,
    Effect,
    EffectType,
    StanceMultiplier,
    StanceName,
} from '@shared'
import { intersection } from 'lodash'

import { getRulebook } from '@/rulebook'
import type { BattleCursor } from '@/util'

import { getTransformed, isSpecial } from './specialMoves'

export function getDamageForCard({
    card,
    scene,
}: {
    card: Card
    scene: BattleCursor
}): number {
    return scene.get('allCharacters', card.characterUid).strength
}

// export function getEffectsForCard({
//     card,
//     scene,
// }: {
//     card: Card
//     scene: BattleCursor
// }): number {
//     return scene.get('allCharacters', card.characterUid).strength
// }

export function getCharacterMovesWithDamageRanges(
    character: CharacterMeta
): CharacterMove[] {
    return character.moves.map(move => {
        const damageRange = getMoveMultiplierRange(move).map(multiplier =>
            getDamage(character, multiplier)
        )

        return {
            ...move,
            damageRange,
        }
    })

    function getDamage(character: CharacterMeta, multiplier: number): number {
        const damage = Math.round(
            character.damage * getAttackMultiplier(character) * multiplier
        )
        return damage < 1 ? 1 : damage
    }
}

export function getCharacterKeysAndDamages(
    attackData: Readonly<AttackData>,
    scene: BattleCursor
): { key: CharacterUid; damage: number }[] {
    const kds = attackData.defenders.map(defender => ({
        key: defender.uid,
        damage: getDamage({ ad: attackData, defender, scene }),
    }))

    if (attackData.attacker.effects.length > 0) {
        attackData.attacker.effects.forEach(e => {
            if (e.damagesByRound == null) return
            if (e.remainingRounds == null) {
                throw Error('bad attack effect data')
            }
            if (e.remainingRounds <= 0) {
                throw Error('trying to apply exhausted effect')
            }

            const damage =
                e.damagesByRound[e.damagesByRound.length - e.remainingRounds]
            kds.push({ key: attackData.attacker.uid, damage })
        })
    }

    return kds
}

export function getCharacterKeysAndEffects(
    attackData: AttackData
): { key: CharacterUid; effect: Effect }[] {
    const keyOnlyEffects: EffectType[] = ['Debilitated']
    const matchedKeyOnlyEffects = intersection(
        attackData.move.types,
        keyOnlyEffects
    ) as EffectType[]
    if (matchedKeyOnlyEffects.length > 0) {
        return matchedKeyOnlyEffects.map(m => ({
            key: attackData.defenders[0].uid,
            effect: { type: m, remainingRounds: 1 },
        }))
    }

    const moveTypeDOT = attackData.move.types.find(m => m.indexOf('DOT') > -1)
    if (moveTypeDOT != null) {
        const moveMeta = getRulebook().moveMetaMap[moveTypeDOT]

        if (moveMeta.effectMultipliers == null) {
            throw Error('bad move meta')
        }
        const effectMultipliers = moveMeta.effectMultipliers
        return attackData.defenders.map(d => ({
            key: d.uid,
            effect: {
                type: moveTypeDOT as EffectType,
                remainingRounds: effectMultipliers.length - 1,
                damagesByRound: [
                    ...effectMultipliers.map(m =>
                        Math.max(
                            1,
                            (attackData.attacker.damage *
                                m *
                                getDefenseMultiplier(d)) |
                                0
                        )
                    ),
                ],
            },
        }))
    }

    return []
}

function getDamage({
    ad,
    defender,
    scene,
}: {
    ad: AttackData
    defender: CharacterMeta
    scene: BattleCursor
}): number {
    // const blessings = getGameStateCursor(username).select('blessings')

    let attackData = ad
    if (isSpecial(ad.move))
        attackData = {
            ...ad,
            move: getTransformed({
                move: ad.move,
                charUid: ad.attacker.uid,
                scene,
            }),
        }

    const dam = Math.round(
        attackData.attacker.damage *
            getAttackMultiplier(attackData.attacker) *
            getMoveMultiplier(attackData) *
            getDefenseMultiplier(defender)
    )

    return dam > 0 ? dam : 1
}

function getAttackMultiplier(attacker: CharacterMeta): number {
    return (
        getEffectAttackMultiplicand(attacker) *
        getStanceTypeMeta(attacker.stance).attackMultiplier
    )
}

function getMoveMultiplier(d: AttackData): number {
    return d.move.types.reduce((multiplier, nextType) => {
        const typeMeta = getRulebook().moveMetaMap[nextType]

        let typeMultiplier: number

        if (
            typeMeta.multipliers != null &&
            Array.isArray(typeMeta.numTargets)
        ) {
            const numDefenders = d.defenders.length
            const relevantMultiplierIndex = typeMeta.numTargets.findIndex(
                num => numDefenders <= num
            )
            if (relevantMultiplierIndex === -1)
                throw new Error('hmm something is deeply wrong')
            typeMultiplier = typeMeta.multipliers[relevantMultiplierIndex]
            logger.info(
                '>>>>>>>>>>>>. hi set typeMultiplier via multipliers array..',
                typeMeta.multipliers
            )
        } else if (typeMeta.multiplier != null) {
            typeMultiplier = typeMeta.multiplier
        } else if (typeMeta.multiplierRange != null) {
            const r = typeMeta.multiplierRange
            typeMultiplier = r[0] + srandom() * Math.abs(r[1] - r[0])
        } else {
            logger.info('><><><><><><><><>< UNIMPLEMENTED! ><><><><><><><><><')
            typeMultiplier = 1
        }

        // logger.info(JSON.stringify({ multiplier, typeMultiplier }))

        return multiplier * typeMultiplier
    }, 1)
}

function getMoveMultiplierRange(
    move: CharacterMove
): [number] | [number, number] {
    // return [1,5]
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY

    move.types.forEach(type => {
        const moveMeta = getRulebook().moveMetaMap[type]
        let multipliers
        if (moveMeta.multiplier != null) multipliers = [moveMeta.multiplier]
        else if (moveMeta.multipliers != null)
            multipliers = [...moveMeta.multipliers]
        else if (moveMeta.multiplierRange != null)
            multipliers = [...moveMeta.multiplierRange]
        else
            throw Error(
                'movemeta has neither multiplier nor multipliers nor multiplierRange'
            )

        const compoundedMin = min < Number.POSITIVE_INFINITY ? min : 1
        const compoundedMax = max > Number.NEGATIVE_INFINITY ? max : 1
        multipliers.forEach(m => {
            if (compoundedMin * m < min) min = compoundedMin * m
            if (compoundedMax * m > max) max = compoundedMax * m
        })
    })

    if (min === max) return [min]

    return [min, max]
}

function getDefenseMultiplier(defender: CharacterMeta): StanceMultiplier {
    return getStanceTypeMeta(defender.stance).defenseMultiplier
}

function getStanceTypeMeta(stance: StanceName | undefined) {
    if (stance == null) throw new Error('invalid stance!')
    const { stanceTypeMetaMap } = getRulebook()

    return stanceTypeMetaMap[stance as StanceName]
}

function getEffectAttackMultiplicand(attacker: CharacterMeta): number {
    let multiplier = 1

    attacker.effects.forEach(e => {
        if (e.type === 'Debilitated') {
            multiplier *= 0.5
        }
    })

    return multiplier
}
