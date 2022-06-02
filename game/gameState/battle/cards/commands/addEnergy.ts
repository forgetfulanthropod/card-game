import type { Executors, Explainers } from './util'
import { evalAll } from './util'

export const explain: Explainers['addEnergy'] = dslArgs => {
    const [amount] = evalAll(dslArgs)
    return `+${amount} energy`
}

export const execute: Executors['addEnergy'] = ({ dslArgs, scene }) => {
    const [amount] = evalAll(dslArgs)

    scene.apply('energy', e => e + amount)
}
