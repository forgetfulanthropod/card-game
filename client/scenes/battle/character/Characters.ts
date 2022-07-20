import { keys, uniq } from 'lodash'
import { Character } from './Character'
import type { PixiContainer } from '@/elementsUtil'
import { For, If } from '@/elementsUtil'
import { localTree } from '@/data'
import { toDatum } from '@/util'

export function Characters(scene: ROBattleScene): PixiContainer {
    const allCharsC = scene.select('allCharacters')

    return For(
        toDatum(allCharsC, c => keys(c)),
        uid =>
            If(
                toDatum(scene.select('allCharacters', uid), c => c.health > 0),
                () =>
                    Character({
                        cursor: allCharsC.select(uid),
                        onClick: () => {
                            localTree
                                .select('selectedTargets')
                                .apply(arr => uniq([...arr, uid]))
                        },
                        scale: 1,
                    })
            ),
        undefined,
        { name: 'CharactersContainer' }
    )
}
