import produce from 'immer'
import type {
    CharacterUid,
    GameActions,
    Pile,
    PlayerCharacterStats,
} from 'shared'

import { getEntrySceneIn } from '@/util'
import { getFullDeckForCharacter } from '@/gameState'
import { rollCharacter } from '@/characterGeneration/roll'
import type { StatName } from '@/characterGeneration/data/stats'
import { equipSword } from './placeSelectedCharacters'

export const rollKaiju: GameActions['rollKaiju'] = args => {
    const scene = getEntrySceneIn(args.game)
    scene.apply(
        'selectedCharacters',
        produce(selected => {
            // TODO integrate hog roller
            const plain = (args as any).plain !== false // default to plain body parts
            const enhanced = !!(args as any).enhanced
            const rolledCharacter = rollCharacter(undefined, undefined, plain, enhanced)
            const stats = Object.fromEntries(
                Object.entries(rolledCharacter.calculatedStats).map(
                    ([k, v]) => {
                        return [k, Math.ceil(v as number)]
                    }
                )
            ) as Record<StatName, number>
            logger.debug(`rolled Character: ${JSON.stringify(rolledCharacter)}`)
            const characterStats: PlayerCharacterStats = {
                id: rolledCharacter.species,
                displayName: rolledCharacter.name,
                isPc: true,
                class: rolledCharacter.class,
                ...stats,
                skin: rolledCharacter.skin,
                talents: rolledCharacter.talents,
            }
            logger.debug(characterStats)
            selected[args.placeIndex] = equipSword({
                ...characterStats,
                uid: `pc-${characterStats.id}-${(Math.random() * 10000) | 0}`,
                isPc: true,
            })
        })
    )

    const fullSelectedCharacterDecks: Record<CharacterUid, Pile> = {}

    scene.get('selectedCharacters').forEach(c => {
        if (c == null) return
        fullSelectedCharacterDecks[c.uid] = getFullDeckForCharacter(c, scene)
    })

    scene.set('fullSelectedCharacterDecks', fullSelectedCharacterDecks)
}
