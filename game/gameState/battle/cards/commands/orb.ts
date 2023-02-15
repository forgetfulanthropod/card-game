import { startCase } from 'lodash'
import type { CharacterUid, OrbType, BattleCursor } from 'shared'

import type { Executors, Explainers } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['orb'] = args => {
    const [orbType, count] = evalAllAsHtml(args)

    return `create ${count} <b>Orbs of ${startCase(orbType)}</b>`
}

export const execute: Executors['orb'] = ({ dslArgs, command, scene }) => {
    const [orbType, count] = evalAll(dslArgs)

    summonOrbs(orbType, count, command.characterUid, scene)
}

function summonOrbs(
    orbType: OrbType,
    count: number,
    characterUid: CharacterUid,
    scene: BattleCursor
) {
    scene.select('allCharacters').apply(characterUid, character => {
        let orbs = character.orbs

        const existingOrbOfTypeIndex = orbs.findIndex(o => o.type === orbType)

        if (existingOrbOfTypeIndex === -1) {
            orbs = [...orbs, { type: orbType, remainingCount: count }]
        } else {
            const newOrbOfType = { ...orbs[existingOrbOfTypeIndex] }
            newOrbOfType.remainingCount += count
            orbs = [
                ...orbs.slice(0, existingOrbOfTypeIndex),
                newOrbOfType,
                ...orbs.slice(existingOrbOfTypeIndex + 1),
            ]
        }

        return { ...character, orbs }
    })
}
