import type {
    CharacterUid,
    BattleCursor,
    CharacterMeta,
    CommandId,
    Effect,
    CharacterId,
} from 'shared'
import { calculateStats } from '../characters/effects'
import { updateNpcMoves } from '@/gameState'
import { checkServerScoringEvent } from '../score/checkServerScoringEvent'
import { clearDead } from './clearDead'
import { applyEffect } from '../cards/commands/effect'

export function applyDamage(args: {
    damage: number
    targetUid: CharacterUid
    attackerUid?: CharacterUid
    scene: BattleCursor
    attacker?: CharacterMeta
}): number {
    const { damage, targetUid, scene, attackerUid, attacker } = args
    if (attacker == null && attackerUid == null) {
        throw new Error('must provide attacker or attackerUid')
    }

    if (attackerUid?.includes('pc')) {
        checkServerScoringEvent('HIGHEST_DAMAGE', scene, args)
    }

    const calcedDamage = getDamage({
        //@ts-expect-error
        attacker: attacker ?? scene.get('allCharacters', attackerUid),
        target: scene.get('allCharacters', targetUid),
        damage,
    })

    const unblockedDamage = applyCalcedDamage(scene, targetUid, calcedDamage)

    manageSideEffectsOfNewDamage(scene, targetUid, calcedDamage)

    if (unblockedDamage === Number.NEGATIVE_INFINITY)
        throw new Error("unblocked damage wasn't calculated")

    return unblockedDamage
}

function applyCalcedDamage(
    scene: BattleCursor,
    targetUid: CharacterUid,
    calcedDamage: number
) {
    let unblockedDamage = Number.NEGATIVE_INFINITY

    scene.select('allCharacters').apply(targetUid, c => {
        let health = c.health
        let block = c.block

        unblockedDamage = calcedDamage - block

        if (unblockedDamage > 0) {
            block = 0
            health -= unblockedDamage
        } else {
            block -= calcedDamage
        }

        return { ...c, health, block }
    })

    return unblockedDamage
}

function manageSideEffectsOfNewDamage(
    scene: BattleCursor,
    targetUid: CharacterUid,
    calcedDamage: number
) {
    if (didTargetDie(scene, targetUid)) clearDead(scene)

    scene.apply('damagesDealtThisTurn', damages => [
        ...damages,
        { amount: calcedDamage, targetUid },
    ])

    scene.apply('damagesDealtThisRoom', damages => [
        ...damages,
        { amount: calcedDamage, targetUid },
    ])

    if (damageChangesEnemyIntent(scene)) {
        logger.info('updating the NPC moves due to enemy damage')
        updateNpcMoves(scene)
    }

    maybeApplyDamageThresholdDebuffs(scene, targetUid, calcedDamage)
}

function didTargetDie(scene: BattleCursor, targetUid: CharacterUid) {
    return scene.select('allCharacters').get(targetUid).health <= 0
}

export function getDamage({
    attacker,
    target,
    damage,
}: {
    attacker: CharacterMeta
    target: CharacterMeta | null
    damage: number
}) {
    const damageDealMultiplicand =
        calculateStats(attacker).damageDealMultiplicand
    const damageTakeMultiplicand = target
        ? calculateStats(target).damageTakeMultiplicand
        : 1

    // logger.info(
    //     JSON.stringify({ damageDealMultiplicand, damageTakeMultiplicand })
    // )

    const multiplicand = damageDealMultiplicand * damageTakeMultiplicand
    const calcedDamage = Math.ceil(damage * multiplicand)
    return calcedDamage
}

function damageChangesEnemyIntent(scene: BattleCursor): boolean {
    const specialCommanIds: CommandId[] = ['mimicAttack']

    return !!~scene.get('nextNpcCommands').findIndex(command => {
        return specialCommanIds.includes(command.command.id)
    })
}

function maybeApplyDamageThresholdDebuffs(
    scene: BattleCursor,
    targetUid: CharacterUid,
    calcedDamage: number
) {
    const target = scene.get('allCharacters', targetUid)

    const characterIdToThresholdEffectsMap: Partial<
        Record<CharacterId, { health: number; effects: Effect[] }[]>
    > = {
        gnomeBigBomber: [
            {
                health: 0.6,
                effects: [
                    {
                        id: 'debilitated',
                        counter: 2,
                    },
                ],
            },
            {
                health: 0.4,
                effects: [
                    {
                        id: 'stunned',
                        counter: 1,
                    },
                ],
            },
        ],
    }

    if (characterIdToThresholdEffectsMap[target.id] != null) {
        const thresholdEffects = characterIdToThresholdEffectsMap[target.id]
        const character = scene.get('allCharacters', targetUid)
        thresholdEffects?.forEach(thresholdEffect => {
            if (
                thresholdEffect.health >
                    character.health / character.constitution &&
                thresholdEffect.health <=
                    (character.health + calcedDamage) / character.constitution
            ) {
                thresholdEffect.effects.map(effect =>
                    applyEffect(scene, [targetUid], effect.id, effect.counter)
                )
            }
        })

        updateNpcMoves(scene)
    }
}
