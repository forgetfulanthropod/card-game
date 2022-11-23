import type { BattleCursor, CharacterUid } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'
import { calculateStats } from '@/gameState'

export const explain: Explainers['addBlock'] = dslArgs => {
    const [block] = evalAllAsHtml(dslArgs)
    return `Give target Kaiju<br> +${block} block`
}

export const execute: Executors['addBlock'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    const [block] = evalAll(dslArgs)
    scene.apply(['allCharacters', targetUids[0], 'block'], b =>
        Math.ceil(b + block * getBlockMultiplier(targetUids[0], scene))
    )

    scene.apply('blocksAppliedThisTurn', blocks => [
        ...blocks,
        { amount: block, targetUid: targetUids[0] },
    ])
}

function getBlockMultiplier(uid: CharacterUid, scene: BattleCursor): number {
    return calculateStats(scene.get('allCharacters', uid)).blockMultiplier
}
