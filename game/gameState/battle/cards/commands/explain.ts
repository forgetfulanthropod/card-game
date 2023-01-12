import { evalAllAsHtml, Executors, Explainers } from './util'

export const explain: Explainers['explain'] = dslArgs => {
    const all = evalAllAsHtml(dslArgs)
    return all.join('')
}

export const execute: Executors['explain'] = ({ dslArgs }) => {
    // do nothing
}
