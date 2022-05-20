import type { Value as VAngu } from 'angu'
import type { CharacterUid, OrbType, BattleCursor } from 'shared'

import type { ExecuteArgs } from './util/types'

export function explain(orbTypeAngu: VAngu, numCountersAngu: VAngu) {
    const orbType = orbTypeAngu.eval() as OrbType
    const numCounters = numCountersAngu.eval() as number

    return `creates ${numCounters} ${orbType} orbs`
}

export function execute({
    dslArgs: [orbTypeAngu, countAngu],
    card,
    // targetUids,
    scene,
}: ExecuteArgs) {
    const orbType = orbTypeAngu.eval() as OrbType
    const count = countAngu.eval() as number

    summonOrbs(orbType, count, card.characterUid, scene)
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
