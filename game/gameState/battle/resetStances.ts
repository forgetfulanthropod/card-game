import { BattleCursor } from 'shared'
import { keys } from 'shared/code'

export function resetStances(scene: BattleCursor) {
    scene.apply('allCharacters', ac => {
        const newAc = { ...ac }
        keys(newAc).forEach(k => {
            newAc[k] = {
                ...newAc[k],
                stance: 'neutral',
                stanceInPrevTurn: 'neutral',
            }
        })
        return newAc
    })
    scene.set('stanceChangesThisRoom', [])
}
