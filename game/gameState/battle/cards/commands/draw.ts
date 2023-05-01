import produce from 'immer'
import { range, size } from 'lodash'
import { BattleCursor } from 'shared'
import { objShuffle } from 'shared/code'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml, evalAll } from './util'
import { drawCards } from '../drawNewHand'

export const explain: Explainers['draw'] = dslArgs => {
    const [numCards] = evalAllAsHtml(dslArgs)
    return `Draw ${numCards}`
}

export const execute: Executors['draw'] = ({ dslArgs, scene }) => {
    const [numCards] = evalAll(dslArgs)
    drawCards(scene, numCards)
}

export function draw(scene: BattleCursor, numCards: number) {
    drawCards(scene, numCards)
}
