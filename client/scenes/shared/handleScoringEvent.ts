import { callApi } from '@/callApi'
import { RunScoreEvent, isNotifiableEvent, RUN_SCORE_EVENT_META } from 'shared'
import { displayScoreNotification } from './Notification'

const handleScoringEvent = (event: RunScoreEvent, count: number) => {
    if (isNotifiableEvent(event)) {
        displayScoreNotification(
            RUN_SCORE_EVENT_META[event].notificationText,
            'fish',
            RUN_SCORE_EVENT_META[event].pointValue * count,
        )
    }

    callApi('notifyRunScore', { event, count })
}

export { handleScoringEvent }
