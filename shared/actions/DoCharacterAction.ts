import type { CharacterUid } from '..'

export type DoCharacterAction = (args: { uid: CharacterUid }) => void
