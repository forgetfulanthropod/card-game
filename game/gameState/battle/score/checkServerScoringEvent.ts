import {
    BattleCursor,
    CharacterUid,
    CharacterMeta,
    RunScoreAttributeName,
    RUN_TIME_THRESHOLD_MINS,
    NonNotifiableEvent,
} from 'shared'
import { vals } from 'shared/code'
import { trackStanceChanges } from '../endRound'

type applyDamageArgs = {
    damage: number
    targetUid: CharacterUid
    attackerUid?: CharacterUid
    scene: BattleCursor
    attacker?: CharacterMeta
}

const checkServerScoringEvent = (
    event: NonNotifiableEvent,
    scene: BattleCursor,
    data?: any
) => {
    switch (event) {
        case 'HIGHEST_DAMAGE':
            checkHighestDamageHit(scene, data as applyDamageArgs)
            break
        case 'RUN_COMPLETED':
            checkMinsUnderRunThreshold(scene)
            checkSurvivingKaiju(scene)
            break
        case 'BLOCK_OVER_THRESHOLD':
            checkBlocksAppliedInTurn(scene)
            break
        case 'HIT_VULGAR_THRESHOLD':
            checkDamageDealtInTurn(scene)
            break
        case 'STANCE_CHANGES':
            checkStanceChanges(scene)
            break
        case 'CARDS_OVER_THRESHOLD':
            checkCardsOverThreshold(scene)
    }
}

const checkHighestDamageHit = (scene: BattleCursor, data: applyDamageArgs) => {
    const { damage, attackerUid, attacker } = data
    const userIsAttacker =
        ((attackerUid && scene.get('allCharacters', attackerUid).isPc) ||
            (attacker && attacker.isPc)) ??
        false
    if (userIsAttacker) {
        const prevHighest = scene.get('runScore').attributes.highestDamageHit
        if (damage > prevHighest) {
            updateRunScoreAttribute(
                scene,
                'highestDamageHit',
                parseInt(damage.toFixed(0))
            )
        }
    }
}

const checkMinsUnderRunThreshold = (scene: BattleCursor) => {
    const sceneState = scene.get('state')
    if (sceneState !== 'won') {
        return
    }

    scene.select('runDuration').set('endTime', new Date().toUTCString()) // might need to use library or time in DB for this?
    const startTime = scene.select('runDuration').get('startTime')
    const endTime = scene.select('runDuration').get('endTime')

    if (endTime) {
        const totalTimeInSeconds =
            (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000

        const minutes = ~~((totalTimeInSeconds % 3600) / 60)
        const hours = ~~(totalTimeInSeconds / 3600)

        if (hours <= 0 && minutes < RUN_TIME_THRESHOLD_MINS) {
            updateRunScoreAttribute(
                scene,
                'minsUnderRunThreshold',
                RUN_TIME_THRESHOLD_MINS - minutes
            )
        }
    }
}

const checkSurvivingKaiju = (scene: BattleCursor) => {
    const survivingKaiju = vals(scene.get('allCharacters')).filter(
        char => char.isPc
    )
    updateRunScoreAttribute(scene, 'survivingKaiju', survivingKaiju.length)

    const healthRemaining = survivingKaiju.reduce((prev, curr) => {
        return prev + curr.health
    }, 0)

    updateRunScoreAttribute(scene, 'finalUserHealthRemaining', healthRemaining)
}

const checkBlocksAppliedInTurn = (scene: BattleCursor) => {
    const BLOCK_THRESHOLD = 40
    const totalBlockApplied = scene
        .get('blocksAppliedThisTurn')
        .reduce((prev, curr) => {
            if (curr.targetUid.includes('pc')) {
                return prev + curr.amount
            }
            return prev + 0
        }, 0)
    if (totalBlockApplied > BLOCK_THRESHOLD) {
        incrementRunScoreAttribute(scene, 'blocksOverThreshold')
    }
}

const checkDamageDealtInTurn = (scene: BattleCursor) => {
    const VULGAR_DAMAGE_THRESHOLD = 20
    const totalDamageApplied = scene
        .get('damagesDealtThisTurn')
        .reduce((prev, curr) => {
            if (curr.targetUid.includes('pc')) {
                return prev + 0
            }
            return prev + curr.amount
        }, 0)

    if (totalDamageApplied > VULGAR_DAMAGE_THRESHOLD) {
        incrementRunScoreAttribute(scene, 'hitsOverVulgarThreshold')
    }
}

const checkStanceChanges = (scene: BattleCursor) => {
    trackStanceChanges(scene) // used for final turn update
    const STANCE_CHANGES_THRESHOLD = 3
    const stanceChanges = scene.get('stanceChangesThisRoom')
    if (stanceChanges.length === 0) {
        incrementRunScoreAttribute(scene, 'roomsZeroStanceChanges')
    } else if (stanceChanges.length > STANCE_CHANGES_THRESHOLD) {
        updateRunScoreAttribute(
            scene,
            'stanceChangesOverThreshold',
            stanceChanges.length - STANCE_CHANGES_THRESHOLD,
            true
        )
    }
}

const checkCardsOverThreshold = (scene: BattleCursor) => {
    const CARDS_PLAYED_THRESHOLD = 5
    const cardsPlayed = scene.get('cardsPlayedThisTurn')
    if (cardsPlayed.length > CARDS_PLAYED_THRESHOLD) {
        incrementRunScoreAttribute(scene, 'cardsPlayedOverThreshold')
    }
}

const updateRunScoreAttribute = (
    scene: BattleCursor,
    attribute: RunScoreAttributeName,
    count: number,
    increment?: true
): void => {
    const attributes = scene.select('runScore').select('attributes')
    if (increment) {
        attributes.apply(attribute, prev => prev + count)
    } else {
        attributes.set(attribute, count)
    }
}

export const incrementRunScoreAttribute = (
    scene: BattleCursor,
    attribute: RunScoreAttributeName
): void => {
    const attributes = scene.select('runScore').select('attributes')
    const prevValue = attributes.get(attribute)
    attributes.set(attribute, prevValue + 1)
}

export { checkServerScoringEvent }
