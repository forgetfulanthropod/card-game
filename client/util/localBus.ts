import { datum } from 'datums'

import type { CharacterUid, StatChangesMap } from 'shared'
import { Channel } from './channel'

export const hoveredCharacterUid = datum<CharacterUid | null>(null)
export const highlightIntentFrom = datum<CharacterUid | null>(null)
export const targetUidsWaitingForImpact = datum<CharacterUid[]>([])
export const playDamageAnimation = datum<boolean>(false)
export const statChangesDatum = datum({} as StatChangesMap)
export const waitForDeathAnimationsDatum = datum<Record<CharacterUid, boolean>>(
    {}
)

export const animation$ = new Channel<'scene exit done'>('animation')
