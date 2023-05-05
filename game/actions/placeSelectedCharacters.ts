import produce from 'immer'
import {
    CharacterMeta,
    CharacterStats,
    CharacterUid,
    GameActions,
    Pile,
    SelectedCharacter,
    swordPartDefinitionsMap,
    swordPartIds,
    SwordParts,
} from 'shared'

import { getFullDeckForCharacter } from '@/gameState'
import { getEntrySceneIn } from '@/util'
import { keys } from 'shared/code'
import { getUpdatedModifiers } from '@/gameState/battle/cards/commands/modifyStats'

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

    const kind = getRandomPartKind()

    const sword = {
        pommel: {
            kind,
            // kind: getRandomPartKind(),
        },
        handle: {
            kind,
            // kind: getRandomPartKind(),
        },
        guard: {
            kind,
            // kind: getRandomPartKind(),
        },
        blade: {
            kind,
            // kind: getRandomPartKind(),
        },
    } as SwordParts

    let runModifiers = {}

    keys(sword).forEach(swordPartKey => {
        const swordStats =
            swordPartDefinitionsMap[sword[swordPartKey].kind][swordPartKey]

        runModifiers = getUpdatedModifiers(
            { turn: {}, room: {}, run: swordStats },
            runModifiers,
            'run'
        )

        // //@ts-expect-error
        // keys(swordStats).forEach(statKey => {
        //     //@ts-expect-error
        //     if (keys(cm).includes(statKey)) {
        //         const stat = swordStats[statKey]!

        //         const modifiers =
        //     }
        // })
    })
    newCm.statModifiersMap = { turn: {}, room: {}, run: runModifiers }

    newCm.sword = sword

    return newCm

    function getRandomPartKind() {
        return swordPartIds[(Math.random() * swordPartIds.length) | 0]
    }
}
