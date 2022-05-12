import type { CharacterUid } from '@shared'
import { SBaobab } from 'sbaobab'

export const localTree = new SBaobab({
    selectedTargets: [] as CharacterUid[],
})
