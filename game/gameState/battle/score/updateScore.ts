import {
    BattleCursor,
    NotifiableEvent,
    RunScoreEvent,
    RUN_SCORE_EVENT_META,
} from 'shared'
import type { RunScoreUpdate } from 'shared'
import { emit } from '@/util'
import { calculateChestProgress, calculateNewRunScore } from '@/gameState'
export const updateScore = ({
    scene,
    event,
    count,
    notify,
    data,
    increment,
}: {
    scene: BattleCursor
    event: RunScoreEvent
    count: number
    notify?: boolean
    data?: any
    increment?: boolean
}) => {
    const eventMeta = RUN_SCORE_EVENT_META[event]
    const attributeNameInTree = eventMeta.attributeName
    if (increment === undefined) increment = eventMeta.increment
    const attributeCount = scene
        .select('runScore')
        .select('attributes')
        .select(attributeNameInTree)

    const currCount = attributeCount.get()
    const newCount = increment ? currCount + count : count

    attributeCount.set(newCount)

    const scoreEventsThisRoom = scene
        .select('scoreEventsThisRoom')
        .select(attributeNameInTree)
    scoreEventsThisRoom.set(scoreEventsThisRoom.get() + 1)
    const scoreEventsThisTurn = scene
        .select('scoreEventsThisTurn')
        .select(attributeNameInTree)
    scoreEventsThisTurn.set(scoreEventsThisTurn.get() + 1)

    if (notify) {
        const eventData: RunScoreUpdate = {
            event: event as NotifiableEvent,
            count,
            data,
        }
        emit({
            username: scene.get('username'),
            event: {
                type: 'notifyScore',
                data: eventData,
            },
        })
    }

    // 2 calls below might be unnecessary
    calculateNewRunScore(scene)
    calculateChestProgress(scene)
}
