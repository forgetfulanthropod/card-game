import {
    RunScoreEvent,
    isNotifiableEvent,
    BattleCursor,
    CharacterUid,
    CharacterMeta,
    RunScoreAttributeName,
    RUN_TIME_THRESHOLD_MINS,
} from 'shared'

type applyDamageArgs = {
    damage: number
    targetUid: CharacterUid
    attackerUid?: CharacterUid
    scene: BattleCursor
    attacker?: CharacterMeta
}

const checkServerScoringEvent = (
    event: RunScoreAttributeName,
    scene: BattleCursor,
    data: any
) => {
    if (!isNotifiableEvent(event)) {
        switch (event) {
            case 'highestDamageHit':
                checkHighestDamageHit(scene, data as applyDamageArgs)
                break
            case 'minsUnderRunThreshold':
                checkMinsUnderRunThreshold(scene)
        }
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
            scene
                .select('runScore')
                .select('attributes')
                .set('highestDamageHit', damage)
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
            scene
                .select('runScore')
                .select('attributes')
                .set('minsUnderRunThreshold', RUN_TIME_THRESHOLD_MINS - minutes)
        }
    }
}

export { checkServerScoringEvent }
