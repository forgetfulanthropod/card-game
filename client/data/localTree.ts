import { SBaobab } from 'sbaobab'
import type { Card, CharacterUid } from 'shared'

export type CardGroup = {
    sectionTitle: string
    cards: Card[]
}

interface LocalTree {
    selectedTargets: CharacterUid[]
    serverCalls: unknown[]
    cardGroupsInView: CardGroup[]
}

export const localTree = new SBaobab<LocalTree>({
    selectedTargets: [],
    serverCalls: [],
    cardGroupsInView: [],
})
