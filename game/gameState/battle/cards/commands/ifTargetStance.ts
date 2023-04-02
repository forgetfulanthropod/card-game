import type { StanceId } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['ifTargetStance'] = dslArgs => {
    const [stance, explanation] = evalAllAsHtml(dslArgs)
    return `You can only play this card if target Kaiju is in ${stance} stance.<br/>${explanation}`
}

export const execute: Executors['ifTargetStance'] = ({
    dslArgs,
    scene,
    command,
    targetUids,
}) => {
    const stance: StanceId = dslArgs[0].eval()

    targetUids.forEach(uid => {
        if (scene.get('allCharacters', uid, 'stance') === stance)
            dslArgs[1].eval()
    })
}
