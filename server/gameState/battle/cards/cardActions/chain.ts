import type { CharacterUid } from '@shared'
import type { Value as VAngu } from 'angu'

import type { BattleCursor } from '@/util'

export function explain(...chain: VAngu[]) {
    return chain.map(link => link.eval()).join('\n')
}

export function execute({
    dslArgs,
    targetUids,
    scene,
}: {
    dslArgs: VAngu[]
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    void targetUids
    void scene
    dslArgs.forEach(a => a.eval())
}
