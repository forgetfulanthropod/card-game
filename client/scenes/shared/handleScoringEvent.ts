import { callApi } from '@/callApi'
import { ROCursor } from 'sbaobab'
import {
    RunScoreEvent,
    isNotifiableEvent,
    RUN_SCORE_EVENT_META,
    CharacterMeta,
    BattleScene,
} from 'shared'
import { checkOtherScoringEvents } from './checkOtherScoringEvents'
import { displayScoreNotification } from './Notification'

const handleScoringEvent = (
    event: RunScoreEvent,
    count: number,
    scene: ROCursor<BattleScene>,
    data?: any
) => {
    if (isNotifiableEvent(event)) {
        const scorePointsToAdd = RUN_SCORE_EVENT_META[event].pointValue * count

        switch (event) {
            case 'ENEMY_KILLED':
                const { id, displayName } = data[0] as CharacterMeta

                displayScoreNotification(
                    `${displayName} defeated`,
                    `${id}Profile`,
                    scorePointsToAdd
                )
                break
            case 'ROOM_CLEARED':
                displayScoreNotification(
                    'Completed Room',
                    'swordPiercing',
                    scorePointsToAdd
                )
                checkOtherScoringEvents(event, scene)
                break
            case 'WIN_NO_ENERGY_USED':
                displayScoreNotification(
                    'No Energy Used Last Turn',
                    'remainingEnergy',
                    scorePointsToAdd
                )
                break
            case 'OVERKILL':
                displayScoreNotification(
                    'Overkill',
                    'overkill',
                    scorePointsToAdd
                )
                break
            case 'PERFECT_KILL':
                displayScoreNotification(
                    'Perfect Kill',
                    'overkill',
                    scorePointsToAdd
                )
                break
            case 'EXIT_ROOM_FULL_HEALTH':
                displayScoreNotification(
                    'Team in Full Health',
                    'swordShield',
                    scorePointsToAdd
                )
                break
            case 'EXIT_BOSS_FULL_HEALTH':
                displayScoreNotification(
                    'Team in Full Health (Boss)',
                    'swordShield',
                    scorePointsToAdd
                )
                break
            case 'EXIT_BOSS_LOW_DAMAGE':
                displayScoreNotification(
                    'Team Lost Under 15 Health (Boss)',
                    'swordShield',
                    scorePointsToAdd
                )
                break
            case 'BOSS_KILLED':
                displayScoreNotification(
                    'Boss Defeated',
                    'stanceAggressive',
                    scorePointsToAdd
                )
                break
        }
    }

    callApi('notifyRunScore', { event, count })
}

export { handleScoringEvent }
