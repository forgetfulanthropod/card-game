import type { Executors, Explainers } from './util'

export const explain: Explainers['dwindle'] = () => {
    return '<b>Dwindle</b>'
}

export const execute: Executors['dwindle'] = ({ scene, cardUid }) => {
    if (cardUid == null) throw new Error('Trying to dwindle non-card?')

    scene.select('cards', 'hand', cardUid).apply('energy', e => e + 1)
}
