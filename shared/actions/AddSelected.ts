import type { OwnedCharacterStats } from '..'

export type CharacterPlaceIndex = 0 | 1 | 2

export type AddSelected = (args: {
    character: OwnedCharacterStats
    index: CharacterPlaceIndex
}) => void
