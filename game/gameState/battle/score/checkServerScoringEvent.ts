import {
    BattleCursor,
    CharacterUid,
    CharacterMeta,
    RunScoreAttributeName,
    RUN_TIME_THRESHOLD_MINS,
    NonNotifiableEvent,
} from 'shared'
import { vals } from 'shared/code'

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
    data: any
) => {
    switch (event) {
        case 'HIGHEST_DAMAGE':
            checkHighestDamageHit(scene, data as applyDamageArgs)
            break
        case 'RUN_COMPLETED':
            checkMinsUnderRunThreshold(scene)
            checkSurvivingKaiju(scene)
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
    console.log(
        'finished updating surviving kaiju and health remaining for score'
    )
}

const updateRunScoreAttribute = (
    scene: BattleCursor,
    attribute: RunScoreAttributeName,
    count: number
): void => {
    scene.select('runScore').select('attributes').set(attribute, count)
}

export { checkServerScoringEvent }
