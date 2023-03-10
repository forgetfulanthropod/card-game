import { evalAll, Executors, Explainers, s } from './util'

export const explain: Explainers['keep'] = dslArgs => {
    const [numCards] = evalAll(dslArgs)
    return `At the end of your turn, you may keep up to ${numCards} card${s(
        numCards
    )}`
}

export const execute: Executors['keep'] = ({ dslArgs, scene }) => {
    const [numCards] = evalAll(dslArgs)

    scene.set('numAllowedToKeep', numCards)
}
