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
        switch (event) {
            case 'ENEMY_KILLED':
                const { id, displayName } = data[0] as CharacterMeta

                displayScoreNotification(
                    `${displayName} defeated`,
                    `${id}Profile`,
                    RUN_SCORE_EVENT_META[event].pointValue * count
                )
                break
            case 'ROOM_CLEARED':
                displayScoreNotification('Completed Room', 'swordPiercing', 10)
                break
        }
    }

    callApi('notifyRunScore', { event, count })
}

export { handleScoringEvent }
