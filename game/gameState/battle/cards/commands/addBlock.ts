import type { BattleCursor, CharacterUid } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'
import { calcPostEffectStats } from '@/gameState'

export const explain: Explainers['addBlock'] = dslArgs => {
    const [block] = evalAllAsHtml(dslArgs)
    return `+${block} block`
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
}

function getBlockMultiplier(uid: CharacterUid, scene: BattleCursor): number {
    return calcPostEffectStats(scene.get('allCharacters', uid)).blockMultiplier
}
