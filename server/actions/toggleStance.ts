import type { StanceName } from '@shared'
import type { ToggleStance } from '@shared'

import { getCharacterMovesWithDamageRanges, getCharIds } from '@/gameState/battle'
import { getBattleScene, vals } from '@/util'
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
    characterCursor.select('moves').apply(() => {
        logger.info(characterCursor.get())
        return getCharacterMovesWithDamageRanges(characterCursor.get())
    })
    characterCursor.commit()
}
