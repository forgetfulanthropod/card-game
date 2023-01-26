import { upperFirst } from 'lodash'
import type { Executors, Explainers } from './util'

export const explain: Explainers['chain'] = dslArgs => {
    return dslArgs.map(link => upperFirst(link.eval())).join('.<br/>')
}

export const execute: Executors['chain'] = ({ dslArgs }) => {
    dslArgs.forEach(a => a.eval())
}
