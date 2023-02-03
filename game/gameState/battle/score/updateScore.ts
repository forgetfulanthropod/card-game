import {
    BattleCursor,
    NotifiableEvent,
    RunScoreEvent,
    RUN_SCORE_EVENT_META,
} from 'shared'
import type { RunScoreUpdate } from 'shared'
import { emit } from '@/util'
import { calculateChestProgress, calculateNewRunScore } from '@/gameState'
export function updateScore({
    scene,
    event,
    count,
    notify,
    data,
}: {
    scene: BattleCursor
    event: RunScoreEvent
    count: number
    notify?: boolean
    data?: any
}) {
    const attributeNameInTree = RUN_SCORE_EVENT_META[event].attributeName
    const attributeCount = scene
        .select('runScore')
        .select('attributes')
        .select(attributeNameInTree)

    const currCount = attributeCount.get()
    const newCount = currCount + count

    attributeCount.set(newCount)

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
