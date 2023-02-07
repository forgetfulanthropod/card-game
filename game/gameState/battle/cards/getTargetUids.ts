import { Card, CharacterUid, BattleCursor } from 'shared'
import { getLivingNpcs, getLivingPcs } from '../characters/characterGetters'

export function getTargetUids({
    card,
    targetUids,
    scene,
}: {
    card: Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    if (card.targetType === 'allEnemies')
        return getLivingNpcs(scene.get()).map(npc => npc.uid)
    if (card.targetType === 'allFriends')
        return getLivingPcs(scene.get()).map(npc => npc.uid)
    if (card.targetType === 'self') return [card.characterUid]

    return targetUids
}
