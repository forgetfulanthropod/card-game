import type {
    BattleCursor,
    CharacterMeta,
    CharacterUid,
    BattleScene,
    Command,
    EnemyCharacterMeta,
    NetworkEvent,
} from 'shared'

import { vals, weightsToCDF, calculateTaunt } from 'shared/code'
import { SCursor } from 'sbaobab'
import { getRulebook } from '@/rulebook'
import { EntryCursor, isProduction } from '@/util'
import { weightedRandom } from '@/util'

import { emit } from '@/util'

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

export function getLivingNpcUids(scene: BattleScene): CharacterUid[] {
    return getLivingNpcs(scene).map(c => c.uid)
}

export function getLivingNpcs(scene: BattleScene): EnemyCharacterMeta[] {
    //@ts-expect-error
    return vals(scene.allCharacters).filter(
        c => !c.isPc && c.health > 0
    ) as EnemyCharacterMeta[]
}

export function getLivingPcUids(scene: BattleScene): CharacterUid[] {
    return getLivingPcs(scene).map(c => c.uid)
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

export function isPc(scene: BattleScene, uid: CharacterUid): boolean {
    return scene.allCharacters[uid].isPc
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

function getPCTarget(
    ac: CharacterMeta[],
    npcUid: CharacterUid,
    index = 0
): CharacterMeta {
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

    if (index > 0) {
        const targetACIndex = ac.findIndex(
            c => c.uid === allLivingPlayerCharacters[targetIndex].uid
        )
        return getPCTarget(
            [...ac.slice(0, targetACIndex), ...ac.slice(targetACIndex + 1)],
            npcUid,
            index - 1
        )
    }

    return allLivingPlayerCharacters[targetIndex]
}

const targetEnemies = (
    scene: BattleScene,
    command: Command
): CharacterUid[] => {
    for (const v of scene['nextNpcCommands']) {
        if (v.command.characterUid == command.characterUid) {
            return v.targetUids
        }
    }
    const targets: CharacterUid[] = []
    const taunts: Record<CharacterUid, number> = Object.fromEntries(
        getLivingPcs(scene).map(c => {
            const t = calculateTaunt(c)
            return [c.uid, t]
        })
    )
    let userMessage = `acquiring targets for ${command.characterUid} ${
        scene.allCharacters[command.characterUid].id ?? ''
    } attack ${command.id}`
    logger.debug(
        `acquiring targets for ${command.characterUid}  ${
            scene.allCharacters[command.characterUid].id ?? ''
        } attack ${command.id}`
    )
    let weightCdf = weightsToCDF(taunts)
    logger.debug(weightCdf)
    logger.debug(taunts)
    userMessage += `\ntaunts:\t${JSON.stringify(
        taunts
    )}\nCDF:\t${JSON.stringify(weightCdf)}`
    for (let i = 0; i < command.targetNum; i++) {
        // let weightCdf = weightsToCDF(taunts)
        const roll = Math.random()
        logger.debug(`rolled ${roll}`)
        userMessage += `\nrolled ${roll}`
        for (const [id, w] of Object.entries(weightCdf)) {
            if (roll <= w) {
                targets.push(id)
                // delete taunts[id]
                break
            }
        }
    }
    userMessage += `\ntargets: ${JSON.stringify(targets)}`
    logger.debug(`targets: ${JSON.stringify(targets)}`)
    if (isProduction) {
        const networkEventData = {
            type: 'message',
            data: userMessage,
        } as NetworkEvent<string, unknown>
        emit({ username: scene.username, event: networkEventData })
    }
    return targets
}

export function getCommandTargets(
    scene: BattleScene,
    command: Command
): CharacterUid[] {
    if (command.targetType === 'enemies') {
        const targets = targetEnemies(scene, command)
        if (targets.length != command.targetNum) {
            logger.warn(
                `did not target correct number of enemies: ${targets.length} instead of ${command.targetNum}`
            )
            console.log(`targets: ${JSON.stringify(targets)}`)
        }
        return targets
    } else if (command.targetType === 'allEnemies') {
        return getLivingPcs(scene).map(c => c.uid)
    } else if (command.targetType === 'allFriends') {
        return getLivingNpcs(scene).map(c => c.uid)
    } else if (command.targetType === 'self') {
        return [command.characterUid]
    }

    return []
}
