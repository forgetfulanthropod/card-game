import type { CharacterUid, EffectType } from '@shared'
import type { Value as VAngu } from 'angu'

import type { BattleCursor } from '@/util'

import { getUpdatedEffects } from '../../move'
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
    applyEffect({
        type: 'Debilitated',
        targetUids,
        remainingRounds: rounds.eval(),
        scene,
    })
}

function applyEffect({
    type,
    targetUids,
    remainingRounds,
    scene,
}: {
    type: EffectType
    targetUids: CharacterUid[]
    remainingRounds: number
    scene: BattleCursor
}) {
    targetUids.forEach(uid =>
        scene.apply(['allCharacters', uid, 'effects'], effects => {
            return getUpdatedEffects({ type, remainingRounds }, effects)
        })
    )
}
