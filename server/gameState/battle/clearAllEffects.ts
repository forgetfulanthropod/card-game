import { keys } from 'lodash'

import type { BattleCursor } from '@/util'

export function clearAllEffects(scene: BattleCursor): void {
    scene.apply('allCharacters', ac => {
        const newAllCharacters = { ...ac }

        keys(ac).forEach(k => {
            newAllCharacters[k] = { ...ac[k], effects: [], orbs: [] }
        })

        return newAllCharacters
    })
}
