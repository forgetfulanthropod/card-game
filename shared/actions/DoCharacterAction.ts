import type { CharacterUid } from '@shared'

export type DoCharacterAction = (args: { uid: CharacterUid }) => void
