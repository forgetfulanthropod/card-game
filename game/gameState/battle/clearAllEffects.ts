import { keys } from 'lodash'

import type { BattleCursor } from 'shared'

export function clearAllEffects(scene: BattleCursor): void {
    scene.apply('allCharacters', ac => {
        const newAllCharacters = { ...ac }

        keys(ac).forEach(k => {
            newAllCharacters[k] = { ...ac[k], effects: [], orbs: [] }
        })

        return newAllCharacters
    })
}
