import { Card, TargetType } from 'shared'

export function cardUsesArrowTargeting(cardMeta: Card): boolean {
    return !(
        ['self', 'allEnemies', 'allFriends'] as TargetType[]
    ).includes(cardMeta.targetType)
}
