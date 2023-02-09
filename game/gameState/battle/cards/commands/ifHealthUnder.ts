import type { StanceId } from 'shared'
import { evalAll, evalAllAsHtml, Executors, Explainers } from './util'
import {} from './util'

export const explain: Explainers['ifHealthUnder'] = dslArgs => {
    const [threshold, explanation1, explantion2] = evalAllAsHtml(dslArgs)
    return `${explantion2}.<br/>Alternately, if target health under ${threshold}%, ${explanation1}`
}

export const execute: Executors['ifHealthUnder'] = ({
    dslArgs,
    scene,
    targetUids,
}) => {
    const threshold = +dslArgs[0].eval()

    targetUids.forEach(targetUid => {
        const cm = scene.get('allCharacters', targetUid)

        if (cm.health / cm.constitution < threshold / 100) dslArgs[1].eval()
        else dslArgs[2].eval()
    })
}
