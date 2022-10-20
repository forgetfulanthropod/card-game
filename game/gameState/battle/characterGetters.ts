import type {
    BattleCursor,
    CharacterMeta,
    CharacterUid,
    BattleScene,
    Command,
    EnemyCharacterMeta,
} from 'shared'

import { vals } from 'shared/code'
import { SCursor } from 'sbaobab'
import { range } from 'lodash'
import { getRulebook } from '@/rulebook'
import type { EntryCursor } from '@/util'
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

export function getLivingNpcs(scene: BattleScene): EnemyCharacterMeta[] {
    //@ts-expect-error
    return vals(scene.allCharacters).filter(
        c => !c.isPc && c.health > 0
    ) as EnemyCharacterMeta[]
}

export function getLivingPcs(scene: BattleScene): CharacterMeta[] {
    return vals(scene.allCharacters).filter(c => c.isPc && c.health > 0)
}

export function getDeadPcs(scene: BattleScene): CharacterMeta[] {
    return vals(scene.allCharacters).filter(c => c.isPc && c.health <= 0)
}

export function isAlive(scene: BattleScene, uid: CharacterUid): boolean {
    return scene.allCharacters[uid]?.health > 0
}

export function getCharacterMeta(
    scene: BattleCursor | EntryCursor,
    uid: CharacterUid
): CharacterMeta {
    return (
        (scene as BattleCursor).get('allCharacters', uid) ||
        (scene as EntryCursor)
            .get('selectedCharacters')
            ?.find(c => c?.uid === uid)
    )
}

/*
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
*/

function getPCTarget(ac: CharacterMeta[], npcUid: CharacterUid): CharacterMeta {
    const { stanceTypeMetaMap } = getRulebook()
    const allLivingPlayerCharacters = ac.filter(c => c.isPc && c.health > 0)

    const likelihoods = allLivingPlayerCharacters.map(
        c => stanceTypeMetaMap[c.stance].targetLikelihood
    )
    const maxLikelihood = Math.max(...likelihoods)

    // const targetIndex = weightedRandom(
    //     likelihoods.map(likelihood => (likelihood === maxLikelihood ? 1 : 0))
    // )
    const verticalPlacementDifferentials = allLivingPlayerCharacters.map(
        (cm, i) =>
            likelihoods[i] === maxLikelihood
                ? Math.abs(cm.y - ac.find(c => c.uid === npcUid)!.y)
                : Number.POSITIVE_INFINITY
    )
    const targetIndex = likelihoods.findIndex(
        (likelihood, i) =>
            likelihood === maxLikelihood &&
            verticalPlacementDifferentials[i] ===
                Math.min(...verticalPlacementDifferentials)
    )

    return allLivingPlayerCharacters[targetIndex]
}

export function getCommandTargets(
    scene: BattleScene,
    command: Command
): CharacterUid[] {
    if (command.targetType === 'enemies') {
        return range(command.targetNum).map(
            () =>
                getPCTarget(vals(scene.allCharacters), command.characterUid).uid
        )
    } else if (command.targetType === 'allEnemies') {
        return getLivingPcs(scene).map(c => c.uid)
    } else if (command.targetType === 'self') {
        return [command.characterUid]
    }

    return []
}
