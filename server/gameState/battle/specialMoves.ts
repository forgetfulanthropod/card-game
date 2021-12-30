import type {
    AttackData,
    CharacterMove,
    CharacterUid,
    NetworkEvent,
} from '@shared'

import { getGameStateCursor } from '@/util'

export function isSpecial(move: CharacterMove): boolean {
    return move.types.includes('MIM')
}

export function getTransformed({
    move,
    charUid,
    username,
}: {
    move: CharacterMove
    charUid: CharacterUid
    username: string
}): CharacterMove {
    if (move.types.includes('MIM'))
        return getMimicMove({ move, charUid, username })

    return move
}

function getMimicMove({
    move,
    charUid,
    username,
}: {
    move: CharacterMove
    charUid: CharacterUid
    username: string
}): CharacterMove {
    const lastAttackOnThisCharacter = [
        ...(getGameStateCursor(username)
            .select('events')
            .get('move$') as NetworkEvent<'move$', AttackData>[]),
    ]
        ?.reverse()
        ?.find(event => event.data.defenders.find(d => d.uid === charUid))

    const types = lastAttackOnThisCharacter?.data?.move?.types ?? ['MIM']

    return {
        ...move,
        types,
    }
}
