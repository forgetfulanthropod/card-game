import { BattleCursor, StatModifierExpiration } from 'shared'
import { keys } from 'shared/code'

export function clearCharacterStatModifiers(
    scene: BattleCursor,
    expiration: StatModifierExpiration
) {
    scene.apply('allCharacters', ac => {
        const newAc = { ...ac }
        keys(newAc).forEach(k => {
            newAc[k] = {
                ...newAc[k],
                statModifiersMap: {
                    ...newAc[k].statModifiersMap,
                    [expiration]: {},
                },
            }
        })
        return newAc
    })
}
