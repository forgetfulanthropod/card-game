import type { CharacterName } from '.'

type EnemyLevel = number
type Probability = number
type Outcome = [CharacterName, EnemyLevel][]
export type RoomOutcomes = {
    outcomes: Outcome[]
    probs: Probability[]
}

export type DungeonRooms = Record<number, Record<string, RoomOutcomes>>
