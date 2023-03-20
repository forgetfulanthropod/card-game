import { datum } from 'datums'

import type {
    CardUid,
    CharacterUid,
    PlayerCharacterStats,
    StatChangesMap,
} from 'shared'
import { Channel } from './channel'

export const hoveredCharacterUid = datum<CharacterUid | null>(null)
export const hoveredCharacterStatsOverride = datum<PlayerCharacterStats | null>(
    null
)
export const selectedForTargetingCardUid = datum<CardUid | null>(null)
export const isTargeting = datum<boolean>(false)
export const highlightIntentFrom = datum<CharacterUid | null>(null)
export const targetUidsWaitingForImpact = datum<CharacterUid[]>([])
export const playDamageAnimation = datum<boolean>(false)
export const statChangesDatum = datum({} as StatChangesMap)
export const waitForDeathAnimationsDatum = datum<Record<CharacterUid, boolean>>(
    {}
)
export const globalShowSims = datum<boolean>(false)
export const sceneEditorIsShown = datum<boolean>(false)
export const ruleBookEditorIsShown = datum<boolean>(false)

export const animation$ = new Channel<'scene exit done'>('animation')
