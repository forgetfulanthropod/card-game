import type { CharacterUid, BattleCursor, CardHit } from 'shared'
import { mapToObj } from 'shared/code'
import { emit } from '@/util'

export function emitDamage({
    moveName,
    attackerUid,
    damage,
    targetUids,
    scene,
}: {
    moveName: string
    attackerUid: CharacterUid
    damage: number
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    const damages = mapToObj(targetUids, () => damage)
    const data: CardHit = {
        cardName: moveName,
        attacker: attackerUid,
        damages,
    }

    emit({
        username: scene.get('username'),
        event: {
            type: 'damage$',
            data,
        },
    })
}
