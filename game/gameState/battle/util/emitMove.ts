import type { CharacterUid, BattleCursor, TargetType, CardHit } from 'shared'
import { emit } from '@/util'

export function emitMove({
    moveName,
    characterUid,
    targetType,
    targetUids,
    scene,
}: {
    moveName: string
    characterUid: CharacterUid
    targetType: TargetType
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    const data: CardHit = {
        cardName: moveName,
        characterUid,
        targetType,
        targetUids,
        // dealsDamage,
    }

    emit({
        userId: scene.get('userId'),
        event: {
            type: 'move$',
            data,
        },
    })
}
