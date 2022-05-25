import type { Value as VAngu } from 'angu'
import type { Card, CharacterUid, BattleCursor } from 'shared'

export type ExecuteArgs = {
    dslArgs: VAngu[]
    card: Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}
