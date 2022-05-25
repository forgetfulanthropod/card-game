import type { CharacterName } from './index'

type EnemyLevel = number
type Probability = number
type Outcome = [CharacterName, EnemyLevel][]
export type RoomOutcomes = {
    outcomes: Outcome[]
    probs: Probability[]
}

export type DungeonRooms = Record<number, Record<string, RoomOutcomes>>
