import type { CharacterMeta, CharacterUid, BattleCursor, Card } from 'shared'

import { vals } from 'shared/code'
import { getRulebook } from '@/rulebook'
import { weightedRandom } from '@/util'

function ac(scene: BattleCursor) {
    return vals(scene.get('allCharacters'))
}

export function getRandomLivingNpcUid(scene: BattleCursor): CharacterUid {
    const uids = vals(scene.get('allCharacters'))
        .filter(c => c.isPc === false && c.health > 0)
        .map(x => x.uid)
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

// TODO
export function getDefenders(
    defender: CharacterMeta,
    card: Card,
    ac: CharacterMeta[]
): CharacterMeta[] {
    return [ac[0]]
}
