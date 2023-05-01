import type { Executors, Explainers } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['incrementSouvenir'] = dslArgs => {
    const [idx] = evalAllAsHtml(dslArgs)
    return `counter + 1`
}

export const execute: Executors['incrementSouvenir'] = ({ dslArgs, scene }) => {
    const [idx] = evalAll(dslArgs)
    scene.apply(['souvenirs', idx, 'counter'], count => (count ? count + 1 : 1))
}
