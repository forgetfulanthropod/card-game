import { vals } from 'shared/code'
import { uniq } from 'lodash'
import type { StatChangesMap } from 'shared'
import { datum } from 'datums'
import { Character } from './Character'
import type { PixiContainer } from '@/elementsUtil'
import { For, If } from '@/elementsUtil'
import { localTree } from '@/data'
import { toDatum } from '@/util'

export function Characters(scene: ROBattleScene): PixiContainer {
    const allCharsC = scene.select('allCharacters')
    const aliveUids = toDatum(allCharsC, chars =>
        vals(chars)
            // .filter(({ health }) => health > 0)
            .map(({ uid }) => uid)
    )
    const statChangesDatum = datum({} as StatChangesMap)

    return For(
        aliveUids,
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
                        statChangesDatum,
                    })
            ),
        undefined,
        { name: 'CharactersContainer' }
    )
}
