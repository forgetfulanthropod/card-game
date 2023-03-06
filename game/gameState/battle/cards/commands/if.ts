import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['if'] = dslArgs => {
    const [condition, outcomeIfTrue, outcomeIfFalse] = evalAllAsHtml(dslArgs)
    return `If ${condition}, ${outcomeIfTrue}, otherwise ${outcomeIfFalse}`
}

export const execute: Executors['if'] = ({ dslArgs }) => {
    dslArgs[0].eval() ? dslArgs[1].eval() : dslArgs[2]?.eval()
}
