import { AssetKey } from '@/assets'
import { callApi } from '@/callApi'
import { ROCursor } from 'sbaobab'
import {
    RUN_SCORE_EVENT_META,
    CharacterMeta,
    BattleScene,
    NotifiableEvent,
    RunScoreUpdate,
} from 'shared'
import { checkOtherScoringEvents } from './checkOtherScoringEvents'
import { displayScoreNotification } from './Notification'

export const depricatedScoreUpdateFromClient = (
    event: NotifiableEvent,
    count: number,
    scene: ROCursor<BattleScene>,
    data?: any
) => {
    showScoreUpdateNotification({ event, count, data })

    callApi('notifyRunScore', { event, count })
}

export const showScoreUpdateNotification = ({
    event,
    count,
    data,
}: RunScoreUpdate) => {
    const scorePointsToAdd = RUN_SCORE_EVENT_META[event].pointValue * count

    switch (event) {
        case 'ENEMY_KILLED':
            if (!data[0]) {
                return
            }

            const id = data[0]?.id as CharacterMeta
            const displayName = data[0]?.displayName as CharacterMeta
            displayScoreNotification(
                `${displayName} defeated`,
                `${id}Profile` as AssetKey,
                scorePointsToAdd
            )
            break
        case 'ROOM_CLEARED':
            displayScoreNotification(
                'Room Cleared',
                'swordPiercing',
                scorePointsToAdd
            )
            // checkOtherScoringEvents(event, scene)
            break
        case 'ROOM_WIN_NO_ENERGY_USED':
            displayScoreNotification(
                RUN_SCORE_EVENT_META[event].keyword,
                'remainingEnergy',
                scorePointsToAdd
            )
            break
        case 'OVERKILL':
            displayScoreNotification('Overkill', 'overkill', scorePointsToAdd)
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
                RUN_SCORE_EVENT_META[event].keyword,
                'swordShield',
                scorePointsToAdd
            )
            break
        case 'EXIT_BOSS_FULL_HEALTH':
            displayScoreNotification(
                RUN_SCORE_EVENT_META[event].keyword,
                'swordShield',
                scorePointsToAdd
            )
            break
        case 'EXIT_BOSS_LOW_DAMAGE':
            displayScoreNotification(
                RUN_SCORE_EVENT_META[event].keyword,
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
        case 'ROOM_WIN_ZERO_DAMAGE':
            displayScoreNotification(
                RUN_SCORE_EVENT_META[event].keyword,
                'swordShield',
                scorePointsToAdd
            )
    }
}
