import type { CharacterMeta, CharacterUid } from '@shared'

import { stringKeys, vals } from '@/util'

import { randomEl, weightedRandom } from './misc'


export function getId(x: number, y: number): string { return `${x}-${y}` }

export function getLivingChars(
    allCharacters: Record<string, CharacterMeta>
): { alivePcs: CharacterMeta[]; aliveNpcs: CharacterMeta[] } {
    const alivePcs = vals(allCharacters).filter(c => c.isPc && c.health > 0)
    const aliveNpcs = vals(allCharacters).filter(c => !c.isPc && c.health > 0)
    return { alivePcs, aliveNpcs }
}
type CharacterFilters = Partial<CharacterMeta>
export function getCharIds(ac: CharacterMeta[], filters: CharacterFilters): CharacterUid[] {
    if (filters == null)
        return []

    return ac
        .filter(c => {
            //@ts-expect-error
            return stringKeys(filters).every((filterKey): boolean => {
                if (typeof filters[filterKey] === 'boolean')
                    return c[filterKey] === filters[filterKey]
                if (typeof filters[filterKey] === 'number')
                    //@ts-expect-error
                    return c[filterKey] >= filters[filterKey]
                throw Error('invalid filterKey')
            })
        })
        .map(c => {
            return c.uid
        })
}
export function getClosestAlive(allCharacters: CharacterMeta[], character: CharacterMeta, nthClosest: number): CharacterMeta | null {
    const charDist = (a: CharacterMeta, b: CharacterMeta) => dist([a.x, a.y], [character.x, character.y]) - dist([b.x, b.y], [character.x, character.y])
    return [...allCharacters]
        .filter(c => c.isPc === character.isPc && c.health > 0)
        .sort((a, b) => charDist(a, b))[nthClosest]
}

function dist([x1, y1]: [number, number], [x2, y2]: [number, number]) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}
export function getUnmovedNpc(ac: CharacterMeta[]): CharacterMeta | null {
    const chars = ac.filter(c => !c.isPc && c.health > 0 && !c.hasMoved)
    if (chars.length === 0) { return null }
    return randomEl(chars)
}

export function getUnmovedPc(ac: CharacterMeta[], excludeId: string): CharacterMeta | null {
    const chars = ac.filter(c => c.isPc && c.health > 0 && !c.hasMoved && c.uid !== excludeId)
    if (chars.length === 0) { return null }
    return randomEl(chars)
}
export function getPCTarget(ac: CharacterMeta[]): CharacterMeta {
    const allLivingPlayerCharacters = ac
        .filter(c => c.isPc && c.health > 0)

    const targetIndex = weightedRandom(
        allLivingPlayerCharacters
            .map(c => stanceTypeMetaMap[c.stance].targetLikelihood)
    )

    return allLivingPlayerCharacters[targetIndex]
}
