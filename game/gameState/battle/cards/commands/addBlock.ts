import type { BattleCursor, CharacterUid } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'
import { calculateStats } from '@/gameState'
import { getTargetText } from './util/getTargetText'

export const explain: Explainers['addBlock'] = (dslArgs, context) => {
    const [block] = evalAllAsHtml(dslArgs)
    return `Give ${getTargetText(
        context.command.targetType,
        context.characterMeta
    )} +${block} block`
}

export const execute: Executors['addBlock'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    const [block] = evalAll(dslArgs)

    targetUids.forEach(targetUid => {
        scene.apply(['allCharacters', targetUid, 'block'], b =>
            Math.ceil(b + block * getBlockMultiplier(targetUids[0], scene))
        )

        scene.apply('blocksAppliedThisTurn', blocks => [
            ...blocks,
            { amount: block, targetUid },
        ])
    })
}

function getBlockMultiplier(uid: CharacterUid, scene: BattleCursor): number {
    return calculateStats(scene.get('allCharacters', uid)).blockMultiplier
}
