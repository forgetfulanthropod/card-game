import { upperFirst } from 'lodash'
import { evalAllAsHtml, Executors, Explainers } from './util'

export const explain: Explainers['join'] = dslArgs => {
    const links = evalAllAsHtml(dslArgs)
    return links.join(' ')
}

export const execute: Executors['join'] = ({ dslArgs }) => {
    //join is just for explanations
}
