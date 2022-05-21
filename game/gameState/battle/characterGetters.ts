import type {
    CharacterMeta,
    CharacterMove,
    CharacterUid,
    BattleCursor,
} from 'shared'

import { getRulebook } from '@/rulebook'
import { vals, weightedRandom } from '@/util'

function ac(scene: BattleCursor) {
    return vals(scene.get('allCharacters'))
}

export function getRandomLivingNpcUid(scene: BattleCursor): CharacterUid {
    const uids = vals(scene.get('allCharacters')).filter(
        c => c.isPc === false && c.health > 0
    )
    const randomIndex = Math.floor(srandom() * uids.length)
    return uids[randomIndex]
}

function getClosestAlive(
    allCharacters: CharacterMeta[],
    character: CharacterMeta,
    nthClosest: number
): CharacterMeta | null {
    const charDist = (a: CharacterMeta, b: CharacterMeta) =>
        dist([a.x, a.y], [character.x, character.y]) -
        dist([b.x, b.y], [character.x, character.y])
    return [...allCharacters]
        .filter(c => c.isPc === character.isPc && c.health > 0)
        .sort((a, b) => charDist(a, b))[nthClosest]
}

function dist([x1, y1]: [number, number], [x2, y2]: [number, number]) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export function getPCTarget(ac: CharacterMeta[]): CharacterMeta {
    const { stanceTypeMetaMap } = getRulebook()
    const allLivingPlayerCharacters = ac.filter(c => c.isPc && c.health > 0)

    const targetIndex = weightedRandom(
        allLivingPlayerCharacters.map(
            c => stanceTypeMetaMap[c.stance].targetLikelihood
        )
    )

    return allLivingPlayerCharacters[targetIndex]
}

export function getDefenders(
    defender: CharacterMeta,
    move: CharacterMove,
    ac: CharacterMeta[]
): CharacterMeta[] {
    const { moveMetaMap } = getRulebook()
    const defenders = [defender]

    let numTargets = 1
    move.types
        .map(t => moveMetaMap[t])
        .forEach(moveMeta => {
            const numForMove =
                typeof moveMeta.numTargets === 'number'
                    ? moveMeta.numTargets
                    : moveMeta.numTargets[moveMeta.numTargets.length - 1]
            if (numForMove > numTargets) numTargets = numForMove
        })
    if (numTargets > 1) {
        for (let i = 1; i < numTargets; i++) {
            const closest = getClosestAlive(ac, defender, i)
            if (closest != null) defenders.push(closest)
        }
    }

    return defenders
}
