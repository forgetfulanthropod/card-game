import type { Value as VAngu } from 'angu'
import type { Card, CharacterUid } from 'shared'
import type { BattleCursor } from 'shared'

export type ExecuteArgs = {
    dslArgs: VAngu[]
    card: Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}
