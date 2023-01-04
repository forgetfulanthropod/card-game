import {
    BattleCursor,
    NotifiableEvent,
    RunScoreEvent,
    RUN_SCORE_EVENT_META,
} from 'shared'
import { getBattleSceneIn } from '@/util'
import { calculateChestProgress, calculateNewRunScore } from '@/gameState'

export function updateScore({
    scene,
    event,
    count,
    notify,
}: {
    scene: BattleCursor
    event: RunScoreEvent
    count: number
    notify?: boolean
}) {
    const attributeNameInTree = RUN_SCORE_EVENT_META[event].attributeName
    const attributeCount = scene
        .select('runScore')
        .select('attributes')
        .select(attributeNameInTree)

    const currCount = attributeCount.get()
    const newCount = currCount + count

    attributeCount.set(newCount)

    if (notify)
        scene.set('runScoreUpdate', {
            event: event as NotifiableEvent,
            count,
        })

    // 2 calls below might be unnecessary
    calculateNewRunScore(scene)
    calculateChestProgress(scene)
}
