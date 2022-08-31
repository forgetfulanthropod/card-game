import type { Executors, Explainers } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['killIf'] = dslArgs => {
    const [condition] = evalAllAsHtml(dslArgs)
    // TODO: proper explainer
    return `Kill enemy if ${condition}`
}

export const execute: Executors['killIf'] = ({
    dslArgs,
    targetUids,
    scene,
    command,
}) => {
    const [condition] = evalAll(dslArgs)
    if (targetUids.length !== 1) throw Error('killIf only works on one target')
    const targetUid = targetUids[0]
    const healthBefore = scene.get('allCharacters', targetUid, 'health')

    if (healthBefore <= 0) {
        logger.warn('killIf: target already dead')
        return
    }

    if (condition) {
        // emitMove({
        //     moveName: 'Kill',
        //     attackerUid: command.characterUid,
        //     // damage: healthBefore,
        //     targetUids: [targetUid],
        //     scene,
        // })

        scene.set(['allCharacters', targetUid, 'health'], 0)
    }
}
