import type { BattleCursor } from 'shared'

import { keys } from 'shared/code'

export function clearBlock(scene: BattleCursor) {
    scene.apply('allCharacters', ac => {
        const newAc = { ...ac }

        keys(newAc).forEach(
            cKey => (newAc[cKey] = { ...newAc[cKey], block: 0 })
        )

        return newAc
    })
}
