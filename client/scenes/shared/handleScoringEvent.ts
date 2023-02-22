import { AssetKey } from '@/assets'
import { RUN_SCORE_EVENT_META, CharacterMeta, RunScoreUpdate } from 'shared'
import { displayScoreNotification } from './Notification'

// TODO: include asset and display string in RunScoreEvent interface?
export const showScoreUpdateNotification = ({
    event,
    count,
    data,
}: RunScoreUpdate) => {
    const scorePointsToAdd = RUN_SCORE_EVENT_META[event].pointValue * count

    switch (event) {
        case 'ENEMY_KILLED':
            if (!data) {
                return
            }
            const id = data.id as CharacterMeta
            const displayName = data.displayName as CharacterMeta
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
            break
        case 'ROOM_WIN_NO_ENERGY_USED':
            displayScoreNotification(
                RUN_SCORE_EVENT_META[event].keyword,
                'remainingEnergy',
                scorePointsToAdd
            )
            break
        case 'PERFECT_KILL':
            displayScoreNotification(
                RUN_SCORE_EVENT_META[event].keyword,
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
            break
        default:
            displayScoreNotification(
                RUN_SCORE_EVENT_META[event].keyword,
                'swordShield',
                scorePointsToAdd
            )
            break
    }
}
