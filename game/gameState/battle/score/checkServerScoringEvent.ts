import {
    RunScoreEvent,
    isNotifiableEvent,
    BattleCursor,
    CharacterUid,
    CharacterMeta,
} from 'shared'

type applyDamageArgs = {
    damage: number
    targetUid: CharacterUid
    attackerUid?: CharacterUid
    scene: BattleCursor
    attacker?: CharacterMeta
}

const checkServerScoringEvent = (
    event: RunScoreEvent,
    scene: BattleCursor,
    data: any
) => {
    if (!isNotifiableEvent(event)) {
        switch (event) {
            case 'HIGHEST_DAMAGE':
                checkHighestDamageHit(scene, data as applyDamageArgs)
                break
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

export { checkServerScoringEvent }
