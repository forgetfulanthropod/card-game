import { Orb } from '@shared'
import { CharacterUid } from '../datamodel'

export type ActivateOrb = (args: {
    characterUid: CharacterUid
    orb: Orb
}) => void
