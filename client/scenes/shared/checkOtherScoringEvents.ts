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
                const userCharsInFullHealth = vals(
                    scene.get('allCharacters')
                ).filter(meta => meta.isPc && meta.constitution === meta.health)

                const allUserCharsInFullHealth =
                    userCharsInFullHealth.length === NUM_KAIJUS_IN_PARTY

                if (allUserCharsInFullHealth) {
                    handleScoringEvent('EXIT_ROOM_FULL_HEALTH', 1)
                }

                break
        }
    }
}

export { checkOtherScoringEvents }
