import { activateSouvenir } from '@/gameState/battle/activateSouvenirs'
import { getBattleSceneIn } from '@/util'
import {
    BattleCursor,
    CharacterUid,
    GameActions,
    SouvenirId,
    souvenirMap,
} from 'shared'

export const chooseEventResponse: GameActions['chooseEventResponse'] = args => {
    const scene = getBattleSceneIn(args.game)
    if (
        scene.get('currentRoom', 'category') !== 'events' ||
        scene.get('isInMap')
    )
        return
    const choice = scene.get('currentRoom', 'event')?.choices[args.index]
    const souvenirId = choice?.souvenirId

    if (choice === undefined) return logger.warn('invalid event response')
    if (
        args.characterUid != null &&
        !scene.get('allCharacters', args.characterUid, 'isPc')
    )
        return logger.warn('invalid character UID')

    if (souvenirId != null)
        acquireSouvenir(souvenirId, args.characterUid, scene)

    scene.set('isInMap', true)
}

export function acquireSouvenir(
    id: SouvenirId,
    characterUid: CharacterUid | undefined,
    scene: BattleCursor
) {
    if (!characterUid && souvenirMap[id].equippable)
        throw new Error('cannot equip to character without characterUid...')

    const newSouvenir = {
        ...souvenirMap[id],
        characterUid: souvenirMap[id].equippable ? characterUid : undefined,
    }

    scene.apply('souvenirs', souvenirs => [...(souvenirs ?? []), newSouvenir])

    activateSouvenir(newSouvenir, 'acquire', scene)
}
