import { ROCursor } from 'sbaobab'
import { RunScoreEvent, BattleScene, NotifiableEvent } from 'shared'
import { vals } from 'shared/code'
import { depricatedScoreUpdateFromClient } from './handleScoringEvent'

export const NUM_KAIJUS_IN_PARTY = 3

/**
 * This fn makes roundtrips to handleScoringEvent to allow for overriding between events that also have a *parent* event that always comes before them (eg. exit room w/full health vs exit boss room w/full health, both come after ROOM_CLEARED)
 */
const checkOtherScoringEvents = (
    event: NotifiableEvent,
    scene: ROCursor<BattleScene>
) => {
    // could change this to be isParentEvent or eventHasDerivedScoringEvents
    switch (event) {
        case 'ROOM_CLEARED':
            handleCharsInFullHealth(scene)
            handleBossRoomCleared(scene)
            handleNoEnergyUsed(scene)
            break
    }
}

const handleCharsInFullHealth = (scene: ROCursor<BattleScene>) => {
    const userCharsInFullHealth = vals(scene.get('allCharacters')).filter(
        meta => meta.isPc && meta.constitution === meta.health
    )

    const partyInFullHealth =
        userCharsInFullHealth.length === NUM_KAIJUS_IN_PARTY

    const roomHadBoss = roomContainsBoss(scene)

    if (partyInFullHealth) {
        const roomTypeEvent: RunScoreEvent = roomHadBoss
            ? 'EXIT_BOSS_FULL_HEALTH'
            : 'EXIT_ROOM_FULL_HEALTH'

        depricatedScoreUpdateFromClient(roomTypeEvent, 1, scene)
    } else if (roomHadBoss) {
        checkHealthLostInBossRoom(scene)
    } else {
        checkHealthLostInRoom(scene)
    }
}

/**
 * This implementation (as well as boss prop in rooms.ts) would need to be moved to Character, if we decide to include other non-boss chars in boss rooms
 */
const handleBossRoomCleared = (scene: ROCursor<BattleScene>): void => {
    if (roomContainsBoss(scene)) {
        depricatedScoreUpdateFromClient('BOSS_KILLED', 1, scene)
    }
}

const roomContainsBoss = (scene: ROCursor<BattleScene>): boolean => {
    const numRoomsPassed = scene
        .select('runScore')
        .select('attributes')
        .get('roomsCleared')
    const currentRoom = scene.get('currentRoom')
    const boss = currentRoom.enemies.filter(enemyChar => enemyChar.boss)
    return boss.length > 0
}

const checkHealthLostInBossRoom = (scene: ROCursor<BattleScene>) => {
    const totalHealthLost = getTotalHealthLost(scene)

    if (totalHealthLost < 15) {
        depricatedScoreUpdateFromClient('EXIT_BOSS_LOW_DAMAGE', 1, scene)
    }
}

const checkHealthLostInRoom = (scene: ROCursor<BattleScene>) => {
    const totalHealthLost = getTotalHealthLost(scene)
    if (totalHealthLost === 0) {
        depricatedScoreUpdateFromClient('ROOM_WIN_ZERO_DAMAGE', 1, scene)
    }
}

const handleNoEnergyUsed = (scene: ROCursor<BattleScene>) => {
    const noEnergyUsed = scene.get('energy') === scene.get('roundEnergy')
    if (noEnergyUsed) {
        depricatedScoreUpdateFromClient('ROOM_WIN_NO_ENERGY_USED', 1, scene)
    }
}

const getTotalHealthLost = (scene: ROCursor<BattleScene>): number => {
    return scene.get('damagesDealtThisRoom').reduce((prev, curr) => {
        if (curr.targetUid.includes('pc')) {
            return curr.amount + prev
        }
        return prev + 0
    }, 0)
}

export { checkOtherScoringEvents }
