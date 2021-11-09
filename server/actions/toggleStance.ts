import type { StanceName, ToggleStance } from '@shared'

import { getCharIds, getModified } from '@/gameState/battle'
import { commit, getBattleScene, vals } from '@/util'

export const toggleStance: ToggleStance = (args) => {
    const { characterUid } = args
    const scene = getBattleScene('alice')
    const ac = scene.select('allCharacters').get()
    if (getCharIds(vals(ac), { isPc: true, hasMoved: true }).length > 0 ||
        scene.select('isPlayerTurn').get() === false)
        return

    const stanceCursor = scene.select('allCharacters').select(characterUid).select('stance')

    const stances: StanceName[] = [
        'defensive',
        'neutral',
        'aggressive',
    ]
    const stance = stanceCursor.get()
    const stanceIndex = stances.findIndex(v => stance === v)

    const nextIndex = (stanceIndex + 1) % stances.length

    stanceCursor.set(stances[nextIndex])

    const characterCursor = scene.select('allCharacters').select(characterUid)
    characterCursor.apply(getModified)
    commit(characterCursor)
}
