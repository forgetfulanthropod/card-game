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
import { updateScore } from '@/gameState'

export function applyDamage(args: {
    damage: number
    targetUid: CharacterUid
    attackerUid?: CharacterUid
    scene: BattleCursor
    attacker?: CharacterMeta
    piercing?: boolean
}): number {
    const { damage, targetUid, scene, attackerUid, attacker, piercing } = args
    if (attacker == null && attackerUid == null) {
        throw new Error('must provide attacker or attackerUid')
    }

    if (attackerUid?.includes('pc')) {
        checkServerScoringEvent('HIGHEST_DAMAGE', scene, args)
    }

    //@ts-expect-error
    const attackerMeta = attacker ?? scene.get('allCharacters', attackerUid)

    const calcedDamage = getDamage({
        attacker: attackerMeta,
        target: scene.get('allCharacters', targetUid),
        damage,
    })

    manageSideEffectsOfCalcedDamage({
        scene,
        targetUid,
        attackerUid: attackerMeta.uid,
        calcedDamage,
    })

    const unblockedDamage = applyCalcedDamage({
        scene,
        targetUid,
        calcedDamage,
        piercing,
    })

    manageSideEffectsOfUnblockedDamage(scene, targetUid, unblockedDamage)

    if (unblockedDamage === Number.NEGATIVE_INFINITY)
        throw new Error("unblocked damage wasn't calculated")

    return unblockedDamage
}

function applyCalcedDamage({
    scene,
    targetUid,
    calcedDamage,
    piercing = false,
}: {
    scene: BattleCursor
    targetUid: CharacterUid
    calcedDamage: number
    piercing?: boolean
}) {
    let unblockedDamage = Number.NEGATIVE_INFINITY

    scene.select('allCharacters').apply(targetUid, c => {
        let health = c.health
        let block = piercing ? 0 : c.block

        unblockedDamage = calcedDamage - block

        if (unblockedDamage > 0) {
            block = 0
            health -= unblockedDamage
        } else {
            block -= calcedDamage
        }

        return { ...c, health, block: piercing ? c.block : block }
    })

    return unblockedDamage
}

function manageSideEffectsOfCalcedDamage({
    scene,
    targetUid,
    attackerUid,
    calcedDamage,
}: {
    scene: BattleCursor
    targetUid: CharacterUid
    attackerUid: CharacterUid
    calcedDamage: number
}) {
    manageReflect(calcedDamage, targetUid, attackerUid, scene)

    recordDamage(scene, calcedDamage, targetUid)
}

function manageReflect(
    calcedDamage: number,
    targetUid: CharacterUid,
    attackerUid: CharacterUid,
    scene: BattleCursor
) {
    const reflectBuff = scene
        .get('allCharacters', targetUid, 'effects')
        .find(e => e.id === 'reflectBuff')

    if (!reflectBuff) return

    const reflectedDamage = Math.min(reflectBuff.counter, calcedDamage)

    applyCalcedDamage({
        scene,
        targetUid: attackerUid,
        calcedDamage: reflectedDamage,
    })
}

function manageSideEffectsOfUnblockedDamage(
    scene: BattleCursor,
    targetUid: CharacterUid,
    unblockedDamage: number
) {
    if (didTargetDie(scene, targetUid)) {
        clearDead(scene)

        applyKillScores(scene, targetUid)
    }

    maybeApplyDamageThresholdDebuffs(scene, targetUid, unblockedDamage)

    if (damageChangesEnemyIntent(scene)) {
        logger.info('updating the NPC moves due to enemy damage')
        updateNpcMoves(scene)
    }
}

function applyKillScores(scene: BattleCursor, targetUid: CharacterUid) {
    const remainingHealth = scene.select('allCharacters').get(targetUid).health
    if (remainingHealth === 0) {
        updateScore({
            scene,
            event: 'PERFECT_KILL',
            count: 1,
            notify: true,
        })
    } else {
        updateScore({
            scene,
            event: 'OVERKILL',
            count: -remainingHealth,
            notify: true,
        })
    }
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
                        id: 'debilitatedDebuff',
                        counter: 2,
                    },
                ],
            },
            {
                health: 0.4,
                effects: [
                    {
                        id: 'stunnedDebuff',
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

function recordDamage(
    scene: BattleCursor,
    calcedDamage: number,
    targetUid: CharacterUid
) {
    scene.apply('damagesDealtThisTurn', damages => [
        ...damages,
        { amount: calcedDamage, targetUid },
    ])

    scene.apply('damagesDealtThisRoom', damages => [
        ...damages,
        { amount: calcedDamage, targetUid },
    ])
}
