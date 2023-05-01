import { activateTalent, talentMap } from '@/gameState/battle/Talents'
import { activateSouvenir } from '@/gameState/battle/activateSouvenirs'
import { getBattleSceneIn } from '@/util'
import {
    BattleCursor,
    CharacterMeta,
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
    if (!souvenirMap[id]) {
        logger.error(`souvenir or talent not implemented: ${id}`)
        return
    }
    if (!characterUid && souvenirMap[id].equippable)
        throw new Error('cannot equip to character without characterUid...')

    const newSouvenir = {
        ...souvenirMap[id],
        characterUid: souvenirMap[id].equippable ? characterUid : undefined,
        counter: 0,
    }

    logger.debug(`souvenir ${id} given to ${characterUid}`)

    scene.apply('souvenirs', souvenirs => [...(souvenirs ?? []), newSouvenir])
    const idx = scene.get('souvenirs').length - 1
    activateSouvenir(newSouvenir, 'acquire', scene, idx)
    activateTalent(newSouvenir, 'acquire', scene, idx)
    return newSouvenir
}

export const acquireTalents = (scene: BattleCursor) => {
    const ac: Record<CharacterUid, CharacterMeta> = scene.get('allCharacters')
    for (const [cuid, cm] of Object.entries(ac)) {
        if (!cm.talents) continue
        for (const { name: talent } of cm.talents) {
            acquireSouvenir(talent as SouvenirId, cuid, scene)
        }
    }
}
