import type { CharacterUid } from '@shared'
import type { Value as VAngu } from 'angu'

import type { BattleCursor } from '@/util'

import { s } from './util/explainHelpers'

export function explain(rounds: VAngu) {
    if (rounds == null) throw new Error('no number of rounds passed in!')

    const n = rounds.eval()
    return `debilitates for ${n} round${s(n)}`
}

export function execute({
    dslArgs: [rounds],
    targetUids,
    scene,
}: {
    dslArgs: VAngu[]
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    // getCharacterKeysAndEffects()
    // const effect
    // scene
    //     .select('allCharacters', targetUid)
    //     .apply('effects', effects => [...effects])
}
