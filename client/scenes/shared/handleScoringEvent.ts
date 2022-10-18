import { callApi } from '@/callApi'
import {
    RunScoreEvent,
    isNotifiableEvent,
    RUN_SCORE_EVENT_META,
    CharacterMeta,
} from 'shared'
import { displayScoreNotification } from './Notification'

const handleScoringEvent = (
    event: RunScoreEvent,
    count: number,
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
                displayScoreNotification('Completed Room', 'swordPiercing', scorePointsToAdd)

                break
            case 'OVERKILL':
                displayScoreNotification(
                    'Overkill',
                    'overkill',
                    scorePointsToAdd
                )
                break
            case 'EXIT_ROOM_FULL_HEALTH':
                displayScoreNotification('Team in Full Health', 'swordShield', scorePointsToAdd)
        }
    }

    callApi('notifyRunScore', { event, count })
}

export { handleScoringEvent }
