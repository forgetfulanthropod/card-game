import { BattleCursor } from 'shared'
import { keys } from 'shared/code'

export function setAllCharactersToUnmoved(scene: BattleCursor) {
    scene.apply('allCharacters', ac => {
        const newAc = { ...ac }
        keys(newAc).forEach(k => {
            newAc[k] = { ...newAc[k], hasMoved: false }
        })
        return newAc
    })
}
