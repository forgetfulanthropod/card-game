import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['drawSizeChange'] = dslArgs => {
    const [amount] = evalAllAsHtml(dslArgs)
    const count = Number(amount)
    return `next turn, draw ${amount} ${count < 0 ? 'fewer' : 'extra'} card${
        Math.abs(count) > 1 ? 's' : ''
    }`
}

export const execute: Executors['drawSizeChange'] = ({ dslArgs, scene }) => {
    const [amount] = evalAll(dslArgs)

    scene.apply('handSize', h => Number(h) + amount)
}
