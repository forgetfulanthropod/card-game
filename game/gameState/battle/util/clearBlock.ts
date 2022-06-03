import produce from 'immer'
import type { BattleCursor } from 'shared'

import { vals } from 'shared/code'

export function clearBlock(scene: BattleCursor, which: 'pc' | 'npc') {
    scene.apply(
        'allCharacters',
        produce(ac => {
            vals(ac)
                .filter(c => c.isPc === (which === 'pc'))
                .forEach(c => (c.block = 0))
        })
    )
}
