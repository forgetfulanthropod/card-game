import { BattleCursor } from 'shared'
import { keys } from 'shared/code'

export function trackStanceChanges(scene: BattleCursor) {
    const allChars = scene.get('allCharacters')
    const newChars = { ...allChars }

    keys(newChars).forEach(uid => {
        if (!allChars[uid].isPc) return
        const stanceInPrevTurn = newChars[uid].stanceInPrevTurn
        const newStance = newChars[uid].stance

        if (newStance !== stanceInPrevTurn) {
            scene.apply('stanceChangesThisRoom', changes => {
                return [...changes, { newStance, targetUid: uid }]
            })
        }

        newChars[uid] = {
            ...newChars[uid],
            stanceInPrevTurn: newStance,
        }
    })

    scene.set('allCharacters', newChars)
    return newChars
}
