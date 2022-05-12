import type { Orb } from '@shared'

import type { CharacterUid } from '../datamodel'

export type ActivateOrb = (args: {
    characterUid: CharacterUid
    orb: Orb
}) => void
