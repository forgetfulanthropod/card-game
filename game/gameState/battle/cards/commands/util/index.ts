import type { Value as VAngu } from 'angu'
import type { Command, CharacterUid, BattleCursor } from 'shared'

export type ExecuteArgs = {
    dslArgs: VAngu[]
    command: Command
    targetUids: CharacterUid[]
    scene: BattleCursor
}

export function s(n: number) {
    return n > 1 ? 's' : ''
}
