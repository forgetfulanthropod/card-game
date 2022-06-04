import type { Executors, Explainers } from './util'
import { evalOne, evalAll } from './util'

export const explain: Explainers['choice'] = dslArgs => {
    const choices = evalAll(dslArgs)
    return `${choices.map((c, i) => `${i > 0 ? '\nor ' : '   '}${c}`).join('')}`
}

export const execute: Executors['choice'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    void evalOne(dslArgs[Math.floor(dslArgs.length * srandom())])
}
