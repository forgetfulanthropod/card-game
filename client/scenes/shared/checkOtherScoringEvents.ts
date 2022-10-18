import { ROCursor } from 'sbaobab'
import { RunScoreEvent, isNotifiableEvent, BattleScene } from 'shared'
import { vals } from 'shared/code'
import { handleScoringEvent } from './handleScoringEvent'

export const NUM_KAIJUS_IN_PARTY = 3

const checkOtherScoringEvents = (
    event: RunScoreEvent,
    scene: ROCursor<BattleScene>
) => {
    // could change this to be isParentEvent or eventHasDerivedScoringEvents
    if (isNotifiableEvent(event)) {
        switch (event) {
            case 'ROOM_CLEARED':
                handleCharsInFullHealth(scene)
                handleBossRoom(scene)
                break
        }
    }
}

const handleCharsInFullHealth = (scene: ROCursor<BattleScene>) => {
    const userCharsInFullHealth = vals(scene.get('allCharacters')).filter(
        meta => meta.isPc && meta.constitution === meta.health
    )

    const partyInFullHealth =
        userCharsInFullHealth.length === NUM_KAIJUS_IN_PARTY

    if (partyInFullHealth) {
        const roomTypeEvent: RunScoreEvent = roomContainsBoss(scene)
            ? 'EXIT_BOSS_FULL_HEALTH'
            : 'EXIT_ROOM_FULL_HEALTH'

        handleScoringEvent(roomTypeEvent, 1)
    }
}

const roomContainsBoss = (scene: ROCursor<BattleScene>): boolean => {
    const currentRoom = scene.get('rooms')[scene.get('numRoomsPassed')]
    const boss = currentRoom.filter(enemyChar => enemyChar.boss)
    return boss.length > 0
}

/**
 * This implementation (as well as boss prop in rooms.ts) would need to be moved to Character, if we decide to include other non-boss chars in boss rooms
 */
const handleBossRoom = (scene: ROCursor<BattleScene>): void => {
    if (roomContainsBoss(scene)) {
        handleScoringEvent('BOSS_KILLED', 1)
    }
}

export { checkOtherScoringEvents }
