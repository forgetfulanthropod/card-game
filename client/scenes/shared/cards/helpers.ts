import { Card, TargetType } from 'shared'

export function cardUsesArrowTargeting(cardMeta: Card): boolean {
    return cardMeta.targetNum !== -1
}
