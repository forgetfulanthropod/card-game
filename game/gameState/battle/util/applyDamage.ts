import { updateNpcMoves, updateScore } from '@/gameState'
import type {
    BattleCursor,
    CharacterId,
    CharacterMeta,
    CharacterUid,
    Effect,
    EnemyCharacterMeta,
} from 'shared'
import { activateSouvenirs } from '../activateSouvenirs'
import {
    activateTalents,
    activateTalentsGeneric,
    activateTalentsGenericNumber,
} from '../Talents'
import { applyEffect } from '../cards/commands/effect'
import {
    maybeActivateRogueAbility,
    maybeResetKnightAbilityCounter,
} from '../characters/activateClassAbility'
import { calculateStats } from '../characters/effects'
import { triggerOnHook } from '../commandHookUtil'
import { checkServerScoringEvent } from '../score/checkServerScoringEvent'
import { clearDead } from './clearDead'

export function applyDamage(args: {
    scene: BattleCursor
    damage: number
    targetUid: CharacterUid
    attackerUid?: CharacterUid
    attacker?: CharacterMeta
    piercing?: boolean
    ignoreModifiers?: boolean
}): number {
    const { damage, targetUid, scene, attackerUid, attacker, piercing } = args

    const target = scene.get('allCharacters', targetUid)

    let attackerMeta: CharacterMeta | null = null
    if (attacker) attackerMeta = attacker
    else if (attackerUid) attackerMeta = scene.get('allCharacters', attackerUid)

    let critChance = 0.05
    if (attackerMeta)
        critChance = calculateStats(attackerMeta).critChance ?? critChance
    if (target && attackerMeta)
        critChance = activateTalents['critChance'](
            scene,
            critChance,
            target,
            attackerMeta
        )
    if (attackerMeta) {
        critChance = activateTalentsGenericNumber({
            scene,
            key: 'critChanceGeneral',
            data: critChance,
            extra: { target, attacker: attackerMeta },
        })
    }
    let isCritical =
        attackerMeta && attackerMeta.isPc
            ? maybeResetKnightAbilityCounter(scene, attackerMeta) ||
              (!scene.get('isSimulation') && Math.random() < critChance)
            : false

    const calcedDamage = args.ignoreModifiers
        ? damage
        : getDamage({
              attacker: attackerMeta,
              target: scene.get('allCharacters', targetUid),
              damage,
              isCritical,
              scene,
          })

    if (attackerUid?.includes('pc')) {
        checkServerScoringEvent('HIGHEST_DAMAGE', scene, {
            ...args,
            damage: calcedDamage,
        })
    }

    attackerMeta &&
        manageSideEffectsOfCalcedDamage({
            scene,
            targetUid,
            attackerUid: attackerMeta.uid,
            calcedDamage,
        })

    if (
        wouldDamageKillTarget({
            scene,
            targetUid,
            calcedDamage,
            piercing,
        }) &&
        activateSouvenirs('lethalDamageInterrupt', scene, targetUid)
    )
        return 0

    const unblockedDamage = applyCalcedDamage({
        scene,
        targetUid,
        calcedDamage,
        piercing,
    })

    if (unblockedDamage > 0) {
        if (attackerMeta?.uid)
            manageMutuallyAssuredDestruction(
                unblockedDamage,
                targetUid,
                attackerMeta?.uid,
                scene
            )

        activateSouvenirs('takeDamage', scene, targetUid)
        activateSouvenirs('dealDamage', scene, attackerUid)
    }

    if (!attackerUid?.includes('pc')) {
        if (calcedDamage > 0 && unblockedDamage === 0) {
            checkServerScoringEvent('PERFECT_BLOCK', scene)
        }
    }

    manageSideEffectsOfUnblockedDamage({
        scene,
        targetUid,
        attacker,
        unblockedDamage,
    })

    if (unblockedDamage === Number.NEGATIVE_INFINITY)
        throw new Error("unblocked damage wasn't calculated")

    if (target.isPc && target.health <= 0) {
        activateTalentsGeneric(scene, 'postDie', target, true, { target })
    }
    if (!target.isPc && target.health <= 0) {
        activateTalentsGeneric(scene, 'postKill', attacker, false, { target })
        activateTalentsGeneric(scene, 'postKillGeneral', undefined, false, {
            target,
        })
    }
    return unblockedDamage
}

export function applyCalcedDamage({
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

export function wouldDamageKillTarget({
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

    const c = scene.get('allCharacters', targetUid)
    let health = c.health
    let block = piercing ? 0 : c.block

    unblockedDamage = calcedDamage - block

    if (unblockedDamage > 0) {
        block = 0
        health -= unblockedDamage
    } else {
        block -= calcedDamage
    }

    return health <= 0
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
    recordDamage(scene, calcedDamage, targetUid, 'raw')
    manageReflect(calcedDamage, targetUid, attackerUid, scene)
    triggerCounterAttack(targetUid, attackerUid, scene)
    triggerOnHook(scene, 'damageTaken', targetUid)
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
        calcedDamage: getDamage({
            scene,
            attacker: scene.get('allCharacters', attackerUid),
            target: scene.get('allCharacters', targetUid),
            damage: reflectedDamage,
        }),
    })
}

function triggerCounterAttack(
    targetUid: CharacterUid,
    attackerUid: CharacterUid,
    scene: BattleCursor
) {
    const hasCounterAttack = scene
        .get('allCharacters', targetUid, 'effects')
        .find(e => e.id === 'counterAttackBuff')

    if (!hasCounterAttack) return

    applyCalcedDamage({
        scene,
        targetUid: attackerUid,
        calcedDamage: getDamage({
            scene,
            attacker: scene.get('allCharacters', attackerUid),
            target: scene.get('allCharacters', targetUid),
            damage: Math.ceil(
                scene.get('allCharacters', targetUid, 'strength') * 0.75
            ),
        }),
    })
}

function manageMutuallyAssuredDestruction(
    unblockedDamage: number,
    targetUid: CharacterUid,
    attackerUid: CharacterUid,
    scene: BattleCursor
) {
    const count = scene
        .get('allCharacters', targetUid, 'effects')
        .find(e => e.id === 'mutuallyAssuredDestructionBuff')?.counter

    if (!count) return

    applyCalcedDamage({
        scene,
        targetUid: attackerUid,
        calcedDamage: getDamage({
            scene,
            attacker: scene.get('allCharacters', attackerUid),
            target: scene.get('allCharacters', targetUid),
            damage: unblockedDamage * 2,
        }),
    })
}

export function manageSideEffectsOfUnblockedDamage({
    scene,
    targetUid,
    unblockedDamage,
    attacker,
}: {
    scene: BattleCursor
    targetUid: CharacterUid
    unblockedDamage: number
    attacker?: CharacterMeta
}) {
    recordDamage(scene, unblockedDamage, targetUid, 'unblocked')
    checkServerScoringEvent('ROOM_TAKE_100_DAMAGE', scene)
    if (didTargetDie(scene, targetUid)) {
        clearDead(scene)

        applyKillScores(scene, targetUid)

        maybeActivateRogueAbility(scene, attacker)
    }

    maybeApplyDamageThresholdDebuffs(scene, targetUid, unblockedDamage)
}

function applyKillScores(scene: BattleCursor, targetUid: CharacterUid) {
    const character = scene.select('allCharacters').get(targetUid)
    // only score on non-playable characters
    if (character.isPc === true) return
    //@ts-expect-error
    const enemy = character as EnemyCharacterMeta
    const remainingHealth = enemy.health
    if (remainingHealth > 0) return
    // 1 point per enemy level
    const enemyLevel = Number(enemy.level)
    if (enemyLevel) {
        updateScore({
            scene,
            event: 'ENEMY_KILLED',
            count: enemyLevel,
            notify: true,
            data: enemy,
        })
    }
    if (remainingHealth === 0) {
        updateScore({
            scene,
            event: 'PERFECT_KILL',
            count: 1,
            notify: true,
        })
    } else if (remainingHealth <= -20) {
        updateScore({
            scene,
            event: 'OVERKILL',
            count: 1,
            notify: true,
        })
    }
}

function didTargetDie(scene: BattleCursor, targetUid: CharacterUid) {
    return scene.select('allCharacters').get(targetUid).health <= 0
}

export function getDamage({
    scene,
    attacker,
    target,
    damage,
    isCritical,
}: {
    scene: BattleCursor
    attacker: CharacterMeta | null
    target: CharacterMeta | null
    damage: number
    isCritical?: boolean
}) {
    const damageDealMultiplicand = attacker
        ? calculateStats(attacker).damageDealMultiplicand
        : 1
    const damageDealAddend = attacker
        ? calculateStats(attacker).damageDealAddend
        : 0
    const damageTakeMultiplicand = target
        ? calculateStats(target).damageTakeMultiplicand
        : 1
    const damageTakeAddend = target
        ? calculateStats(target).damageTakeAddend
        : 0

    if (target && attacker) {
        damage = activateTalents['damageGive'](scene, damage, target, attacker)
        damage = activateTalents['damageGiveFinal'](
            scene,
            damage,
            target,
            attacker
        )
        damage = activateTalentsGenericNumber({
            scene,
            key: 'damageReceive',
            data: damage,
            cm: target,
            extra: { target, attacker },
        })
        damage = activateTalentsGenericNumber({
            scene,
            key: 'damageReceiveFinal',
            data: damage,
            cm: target,
            extra: { target, attacker },
        })
    }
    // logger.info(
    //     JSON.stringify({ damageDealMultiplicand, damageTakeMultiplicand })
    // )

    const multiplicand = damageDealMultiplicand * damageTakeMultiplicand
    let calcedDamage = Math.ceil(
        damage * multiplicand + damageTakeAddend + damageDealAddend
    )

    if (isCritical) {
        let critMultiply = 1.5
        if (attacker)
            critMultiply = activateTalentsGenericNumber({
                scene,
                key: 'critDamageMultiply',
                data: critMultiply,
                cm: attacker,
                extra: { target },
            })
        calcedDamage = Math.ceil(calcedDamage * critMultiply)
    }

    return Math.max(calcedDamage, 1) // damage minimum is 1
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

export function recordDamage(
    scene: BattleCursor,
    amount: number,
    targetUid: CharacterUid,
    type: 'raw' | 'unblocked'
) {
    if (amount <= 0) return
    if (type === 'unblocked') {
        scene.apply('damagesUnblockedThisTurn', damages => [
            ...damages,
            { amount, targetUid },
        ])

        scene.apply('damagesUnblockedThisRoom', damages => [
            ...damages,
            { amount, targetUid },
        ])
    } else {
        scene.apply('damagesDealtThisTurn', damages => [
            ...damages,
            { amount, targetUid },
        ])

        scene.apply('damagesDealtThisRoom', damages => [
            ...damages,
            { amount, targetUid },
        ])
    }
}
