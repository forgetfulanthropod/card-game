import type { CharacterMeta } from '@shared'

import { getCharacterMovesWithDamageRanges } from './attack'
import { blessingUpdate } from './blessings'

/** Returns updated blessing. Does not modify in place! (i.e. pure function) (That's the goal at least.) */


export function getModified(cm: Readonly<CharacterMeta>): CharacterMeta {
    // TODO: should probably make brand new info from stance + a key in the statsMap
    // cm = cleanMetaFromStats(cm)
    cm = blessingUpdate(cm)
    cm = { ...cm, moves: getCharacterMovesWithDamageRanges(cm) }
    return cm
}
