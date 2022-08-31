import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['choice'] = dslArgs => {
    const choices = evalAllAsHtml(dslArgs)
    return `${choices
        .map((c, i) => `${i > 0 ? '<br/>or ' : '   '}${c}`)
        .join('')}`
}

export const execute: Executors['choice'] = ({ dslArgs }) => {
    dslArgs[Math.floor(dslArgs.length * srandom())].eval()
}
