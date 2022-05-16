import type { Orb } from '..'
import type { CharacterUid } from '../datamodel'

export type ActivateOrb = (args: {
    characterUid: CharacterUid
    orb: Orb
}) => void
