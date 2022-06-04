import type { Executors, Explainers } from './util'
import { evalAll } from './util'

export const explain: Explainers['addStrength'] = dslArgs => {
    const [stregth] = evalAll(dslArgs)
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
