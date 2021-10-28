import type { CharacterUid, StanceName } from '@shared'

import { getBattleScene, onCallWrapper, vals } from '@/util'

import { getCharacterMovesWithDamageRanges } from '../gameState/battle/attack'
import { getCharIds } from '../gameState/battle/misc'


export const toggleStance = onCallWrapper(function toggleStance({ characterUid }: { characterUid: CharacterUid }): void {
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
        console.log(characterCursor.get())
        return getCharacterMovesWithDamageRanges(characterCursor.get())
    })
    characterCursor.commit()
})
