import {
    BattleCursor,
    CharacterUid,
    EventChoice,
    GameActions,
    SouvenirId,
    souvenirMap,
} from 'shared'
import produce from 'immer'
import { getBattleSceneIn } from '@/util'
import { activateSouvenir } from '@/gameState/battle/activateSouvenirs'

export const chooseEventResponse: GameActions['chooseEventResponse'] = args => {
    const scene = getBattleSceneIn(args.game)
    if (!scene.get('isInEventScene')) return
    const choice = scene.get('currentRoom', 'event')?.choices[args.index]
    const souvenirId = choice?.souvenirId

    if (choice === undefined) return logger.warn('invalid event response')
    if (
        args.characterUid != null &&
        !scene.get('allCharacters', args.characterUid, 'isPc')
    )
        return logger.warn('invalid character UID')

    if (souvenirId != null)
        collectSouvenir(souvenirId, args.characterUid, scene)

    scene.set('isInEventScene', false)
    scene.set('isInMap', true)
}

// function activateChoice(choice: EventChoice, scene: BattleCursor) {
//     if (choice.souvenirId == null) return

//     collectSouvenir(choice.souvenirId, scene)
// }

function collectSouvenir(
    id: SouvenirId,
    characterUid: CharacterUid | undefined,
    scene: BattleCursor
) {
    const newSouvenir = { ...souvenirMap[id], characterUid }

    scene.apply('souvenirs', souvenirs => [...souvenirs, newSouvenir])

    activateSouvenir(newSouvenir, 'acquire', scene)
}
