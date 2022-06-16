import type { Executors, Explainers } from './util'
import { evalAll } from './util'

export const explain: Explainers['choice'] = dslArgs => {
    const choices = evalAll(dslArgs)
    return `${choices.map((c, i) => `${i > 0 ? '\nor ' : '   '}${c}`).join('')}`
}

export const execute: Executors['choice'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    dslArgs[Math.floor(dslArgs.length * srandom())].eval()
}
