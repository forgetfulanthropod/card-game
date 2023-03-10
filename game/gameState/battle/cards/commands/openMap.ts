import { Executors, Explainers } from './util'

export const explain: Explainers['openMap'] = () => {
    return `Exit room without gaining rewards.`
}

export const execute: Executors['openMap'] = ({ scene }) => {
    scene.set('isInMap', true)
}
