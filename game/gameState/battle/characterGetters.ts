import type {
    BattleCursor,
    CharacterMeta,
    CharacterUid,
    BattleScene,
    Command,
} from 'shared'

import { vals } from 'shared/code'
import { SCursor } from 'sbaobab'
import { getRulebook } from '@/rulebook'
import { weightedRandom } from '@/util'

export function getAllPcs(scene: BattleCursor | BattleScene): CharacterMeta[] {
    return vals(
        scene instanceof SCursor
            ? scene.get('allCharacters')
            : scene.allCharacters
    ).filter((c: CharacterMeta) => c.isPc)
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

export function getPcTargets(
    scene: BattleScene,
    command: Command
): CharacterUid[] {
    return [getPCTarget(vals(scene.allCharacters)).uid]
}
