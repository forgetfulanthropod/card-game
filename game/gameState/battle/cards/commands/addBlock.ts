import { calculateStats } from '@/gameState'
import type { BattleCursor, CharacterUid } from 'shared'
import { maybeIncrementKnightAbility } from '../../characters/activateClassAbility'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'
import { getTargetText } from './util/getTargetText'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'
import { activateTalentsGenericData } from '../../Talents'

export const explain: Explainers['addBlock'] = (dslArgs, context) => {
    const [block] = evalAllAsHtml(dslArgs)
    const [_, targetType] = evalAll(dslArgs)
    return `Give ${getTargetText(
        targetType ?? context.command.targetType,
        context.characterMeta
    )} +${block} block`
}

export const execute: Executors['addBlock'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [block, targetType] = evalAll(dslArgs)

    const targetUids = getTargetUidsOverride({
        targetTypeOverride: targetType,
        scene,
        command,
        givenUids,
    })

    maybeIncrementKnightAbility(scene, command, targetUids)

    applyBlocks({ targetUids, fromUid: command.characterUid, scene, block })
}

export function applyBlocks({
    fromUid,
    targetUids,
    scene,
    block,
}: {
    fromUid: CharacterUid | null
    targetUids: CharacterUid[]
    scene: BattleCursor
    block: number
}) {
    const fromCm = fromUid ? scene.get('allCharacters', fromUid) : null
    targetUids.forEach(targetUid => {
        let target = scene.get('allCharacters', targetUid)

        let blockAddend = fromCm
            ? activateTalentsGenericData({
                  scene,
                  key: 'blockGiveAdd',
                  data: 0,
                  cm: fromCm,
                  extra: { target },
              })
            : 0
        blockAddend = activateTalentsGenericData({
            scene,
            key: 'blockReceiveAdd',
            data: blockAddend,
            cm: target,
            extra: { target: fromCm },
        })

        let blockMultiplier = getBlockMultiplier(targetUids[0], scene)
        blockMultiplier = fromCm
            ? activateTalentsGenericData({
                  scene,
                  key: 'blockGiveMultiply',
                  data: blockMultiplier,
                  cm: fromCm,
                  extra: { target },
              })
            : 1
        blockMultiplier = activateTalentsGenericData({
            scene,
            key: 'blockReceiveMultiply',
            data: blockMultiplier,
            cm: target,
            extra: { target: fromCm },
        })

        const finalBlock = (block + blockAddend) * blockMultiplier

        scene.apply(['allCharacters', targetUid, 'block'], b =>
            Math.ceil(b + finalBlock)
        )

        scene.apply('blocksAppliedThisTurn', blocks => [
            ...blocks,
            { amount: finalBlock, targetUid },
        ])
    })
}

function getBlockMultiplier(uid: CharacterUid, scene: BattleCursor): number {
    return calculateStats(scene.get('allCharacters', uid)).blockMultiplier
}
