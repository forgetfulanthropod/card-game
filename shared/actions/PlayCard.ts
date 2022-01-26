import type { CharacterUid } from '../datamodel'

export type PlayCard = (args: {
    cardUid: string
    targetUids: CharacterUid[]
}) => void
