import type { CharacterMove, CharacterUid, NetworkAttackData } from '@shared'

import type { BattleCursor } from '@/util'

export function isSpecial(move: CharacterMove): boolean {
    return move.types.includes('MIM')
}

export function getTransformed({
    move,
    charUid,
    scene,
}: {
    move: CharacterMove
    charUid: CharacterUid
    scene: BattleCursor
}): CharacterMove {
    if (move.types.includes('MIM'))
        return getMimicMove({ move, charUid, scene })

    return move
}

function getMimicMove({
    move,
    charUid,
    scene,
}: {
    move: CharacterMove
    charUid: CharacterUid
    scene: BattleCursor
}): CharacterMove {
    const lastAttackOnThisCharacter = [
        //@ts-ignore
        ...(scene.up().get('events', 'move$') as NetworkEvent<
            'move$',
            NetworkAttackData
        >),
    ]
        ?.reverse()
        ?.find(({ data }: { data: NetworkAttackData }) =>
            data.defenderUids.find(uid => uid === charUid)
        )

    const types = lastAttackOnThisCharacter?.data?.move?.types ?? ['MIM']

    return {
        ...move,
        types,
    }
}
