import { SBaobab } from 'sbaobab'
import type { CharacterUid } from 'shared'

interface LocalTree {
    selectedTargets: CharacterUid[]
    serverCalls: unknown[]
}

export const localTree = new SBaobab<LocalTree>({
    selectedTargets: [],
    serverCalls: [],
})
