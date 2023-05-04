import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['chance'] = dslArgs => {
    const [chance, success, fail] = evalAllAsHtml(dslArgs)
    return `${chance} chance for ${success} otherwise ${fail}`
}

export const execute: Executors['chance'] = ({ dslArgs }) => {
    const chance = dslArgs[0].eval()
    const roll = Math.random()
    if (roll <= chance) {
        logger.info('chance success!')
        dslArgs[1].eval()
    } else if (dslArgs[2]) {
        dslArgs[2].eval()
    }
}
