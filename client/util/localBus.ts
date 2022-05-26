import { datum } from 'datums'

import type { CharacterUid } from 'shared'

//entry
export const waitingForSceneExitAnimationToFinish = datum<boolean>(false)
export const brightBackLightIsShining = datum<boolean>(false)

//battle
export const hoveredCharacterUid = datum<CharacterUid | null>(null)
