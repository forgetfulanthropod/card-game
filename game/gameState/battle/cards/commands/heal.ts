import { startCase } from 'lodash'
import type {
    BasicTargetType,
    BattleCursor,
    CharacterUid,
    Command,
    EffectId,
} from 'shared'
import { setAt } from 'shared/code'

import type { Executors, Explainers, VAngu } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['heal'] = dslArgs => {
    const [amount] = evalAllAsHtml(dslArgs)
    return `heal for ${amount}`
}

export const execute: Executors['heal'] = ({
    dslArgs,
    targetUids,
    scene,
    command,
}) => {
    const [amount] = evalAll(dslArgs)

    // ALWAYS HEALS SELF
    scene
        .select('allCharacters', command.characterUid, 'health')
        .apply(h => h + Math.ceil(amount))
}
