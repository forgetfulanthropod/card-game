import { vals } from 'shared/code'
import { Character } from './Character'
import type { PixiContainer } from '@/elementsUtil'
import { For } from '@/elementsUtil'
import { localTree } from '@/data'
import { toDatum } from '@/util'

export function Characters(scene: ROBattleScene): PixiContainer {
    const allCharsC = scene.select('allCharacters')
    const aliveUids = toDatum(allCharsC, chars =>
        vals(chars)
            .filter(({ health }) => health > 0)
            .map(({ uid }) => uid)
    )
    return For(
        aliveUids,
        uid =>
            Character({
                cursor: allCharsC.select(uid),
                onClick: () => {
                    console.log('clicked a character')
                    localTree
                        .select('selectedTargets')
                        .apply(arr => [...arr, uid])
                },
                scale: 1,
            }),
        undefined,
        { name: 'CharactersContainer' }
    )
}
