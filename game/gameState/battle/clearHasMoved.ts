import type { BattleCursor } from 'shared'
import { keys } from '@/util'

export function clearHasMoved(scene: BattleCursor) {
    scene.apply('allCharacters', ac => {
        const newAc = { ...ac }

        keys(newAc).forEach(
            cKey => (newAc[cKey] = { ...newAc[cKey], hasMoved: false })
        )

        return newAc
    })
}
