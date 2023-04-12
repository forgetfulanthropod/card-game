import produce from 'immer'
import {
    CharacterMeta,
    CharacterUid,
    GameActions,
    Pile,
    PlayerCharacterStats,
    SelectedCharacter,
    swordPartDefinitionsMap,
    SwordParts,
} from 'shared'

import { getEntrySceneIn } from '@/util'
import { getFullDeckForCharacter } from '@/gameState'
import { keys, vals } from 'shared/code'

export const placeSelectedCharacters: GameActions['placeSelectedCharacters'] =
    args => {
        const scene = getEntrySceneIn(args.game)
        scene.apply(
            'selectedCharacters',
            produce(selected => {
                for (const {
                    allCharacterOptionsIndex,
                    placeIndex,
                } of args.characters) {
                    const characterStats = scene.get('allCharacterOptions')[
                        allCharacterOptionsIndex
                    ]
                    selected[placeIndex] = equipSword({
                        ...characterStats,
                        uid: `pc-${characterStats.id}-${
                            (Math.random() * 10000) | 0
                        }`,
                        isPc: true,
                        // tokenId: '',
                        // nftName: '',
                    })
                }
            })
        )

        const fullSelectedCharacterDecks: Record<CharacterUid, Pile> = {}

        scene.get('selectedCharacters').forEach(c => {
            if (c == null) return
            fullSelectedCharacterDecks[c.uid] = getFullDeckForCharacter(
                c,
                scene
            )
        })

        scene.set('fullSelectedCharacterDecks', fullSelectedCharacterDecks)
    }

export function equipSword(cm: SelectedCharacter): SelectedCharacter {
    if (!cm) throw new Error('null character in equipsword')

    const newCm = { ...cm }

    const sword = {
        pommel: {
            kind: ['dirt', 'normal', 'junk'][(Math.random() * 3) | 0],
        },
        handle: {
            kind: ['dirt', 'normal', 'junk'][(Math.random() * 3) | 0],
        },
        guard: {
            kind: ['dirt', 'normal', 'junk'][(Math.random() * 3) | 0],
        },
        blade: {
            kind: ['dirt', 'normal', 'junk'][(Math.random() * 3) | 0],
        },
    } as SwordParts

    keys(sword).forEach(swordPartKey => {
        const swordStats =
            swordPartDefinitionsMap[sword[swordPartKey].kind][swordPartKey]

        //@ts-expect-error
        keys(swordStats).forEach(stat => {
            newCm[stat] = newCm[stat] + swordStats[stat]!
        })
    })

    newCm.sword = sword

    return newCm
}
