import type { BattleCursor, EventChoice, GameActions, SouvenirId } from 'shared'
import produce from 'immer'
import { getBattleSceneIn } from '@/util'

export const chooseEventResponse: GameActions['chooseEventResponse'] = args => {
    const scene = getBattleSceneIn(args.game)
    if (!scene.get('isInEventScene')) return
    const choice = scene.get('currentRoom', 'event')?.choices[args.index]
    if (choice === undefined) return logger.warn('invalid event response')
    activateChoice(choice, scene)
    scene.set('isInEventScene', false)
    scene.set('isInMap', true)
}

function activateChoice(choice: EventChoice, scene: BattleCursor) {
    if (choice.souvenirId == null) return

    collectSouvenir(choice.souvenirId, scene)
}

function collectSouvenir(id: SouvenirId, scene: BattleCursor) {
    //TODO
}
