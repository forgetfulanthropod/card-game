import produce from 'immer'
import type { CharacterUid, GameActions, Pile } from 'shared'

import { getEntrySceneIn } from '@/util'
import { getFullDeckForCharacter } from '@/gameState'

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
                    selected[placeIndex] = {
                        ...characterStats,
                        uid: `pc-${characterStats.id}-${
                            (Math.random() * 10000) | 0
                        }`,
                        isPc: true,
                        tokenId: '',
                        nftName: '',
                    }
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
