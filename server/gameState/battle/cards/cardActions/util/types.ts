import type { Card, CharacterUid } from '@shared'
import type { Value as VAngu } from 'angu'

import type { BattleCursor } from '@/util'

export type ExecuteArgs = {
    dslArgs: VAngu[]
    card: Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}
