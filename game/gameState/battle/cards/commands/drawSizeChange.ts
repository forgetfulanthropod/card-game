import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['drawSizeChange'] = dslArgs => {
    const [amount] = evalAllAsHtml(dslArgs)
    if (Number(amount) < 0) return `draw ${amount} fewer cards next round`
    else return `draw ${amount} extra cards next round`
}

export const execute: Executors['drawSizeChange'] = ({ dslArgs, scene }) => {
    const [amount] = evalAll(dslArgs)

    scene.apply('handSize', h => Number(h) + amount)
}
