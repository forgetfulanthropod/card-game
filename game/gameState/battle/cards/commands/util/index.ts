import type { Value as VAngu } from 'angu'
import type {
    Command,
    CharacterUid,
    BattleCursor,
    CalculatedCharacterStats,
} from 'shared'

export type ExecuteArgs = {
    dslArgs: VAngu[]
    command: Command
    targetUids: CharacterUid[]
    scene: BattleCursor
    calculatedStats: CalculatedCharacterStats
}

export function s(n: number) {
    return n > 1 ? 's' : ''
}
