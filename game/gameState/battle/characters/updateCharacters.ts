import { keys } from 'lodash'
import { BattleCursor, BattleScene } from 'shared'
import { calculateStats } from './effects'

export function updateCharacters(sceneCursor: BattleCursor) {
    sceneCursor.apply('allCharacters', ac => {
        const newAc = { ...ac }

        keys(ac).map(characterUid => {
            const cm = newAc[characterUid]
            newAc[characterUid] = { ...cm, calculatedStats: calculateStats(cm) }
        })

        return newAc
    })
}
