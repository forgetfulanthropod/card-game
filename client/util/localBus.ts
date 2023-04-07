import { datum } from 'datums'

import type {
    CardTargetingType,
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
export const currTargetingType = datum<CardTargetingType | null>(null) // replaces isTargeting; if null, no card is targeting
export const currAnimatingCardUid = datum<CardUid | null>(null)
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
