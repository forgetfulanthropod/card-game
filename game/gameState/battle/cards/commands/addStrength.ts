import type { Executors, Explainers } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['addStrength'] = dslArgs => {
    const [stregth] = evalAllAsHtml(dslArgs)
    return `+${stregth} stregth`
}

export const execute: Executors['addStrength'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    const [strength] = evalAll(dslArgs)

    scene.apply(['allCharacters', targetUids[0], 'strength'], s => s + strength)
}
