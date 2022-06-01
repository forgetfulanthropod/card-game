import type { Executors, Explainers } from './util'
import { evalAll } from './util'

export const explain: Explainers['text'] = dslArgs => {
    const [text] = evalAll(dslArgs)
    return text
}

export const execute: Executors['text'] = () => {
    // pass
}
