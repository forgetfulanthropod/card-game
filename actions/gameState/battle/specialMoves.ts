import type { CharacterMove, CharacterUid } from '@shared/index'

import { getEventsCursor } from '../../util/treeAccessors'

export function isSpecial(move: CharacterMove): boolean {
    return move.types.includes('MIM')
}

export function getTransformed(move: CharacterMove, charUid: CharacterUid): CharacterMove {
    if (move.types.includes('MIM'))
        return getMimicMove(move, charUid)

    return move
}

function getMimicMove(move: CharacterMove, charUid: CharacterUid): CharacterMove {
    const lastAttackOnThisCharacter = [...getEventsCursor('alice').get()]
        ?.reverse()
        ?.find(event => event.data.defenders.find(d => d === charUid))

    const types = lastAttackOnThisCharacter?.data?.move?.types ?? ['MIM']

    return {
        ...move,
        types
    }
}
