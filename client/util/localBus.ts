import { datum } from 'datums'

import type { CharacterUid } from 'shared'
import { Channel } from './channel'

//entry
export const waitingForSceneExitAnimationToFinish = datum<boolean>(false)
export const brightBackLightIsShining = datum<boolean>(false)

//battle
export const hoveredCharacterUid = datum<CharacterUid | null>(null)
export const highlightIntentFrom = datum<CharacterUid | null>(null)

export const animation$ = new Channel<'scene exit done'>('animation')
