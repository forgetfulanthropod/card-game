import type { Executors, Explainers } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['require'] = dslArgs => {
    const [type, least, most] = evalAllAsHtml(dslArgs)
    const numStr = least === most ? `${least}` : `${least}-${most}`
    const s = least < 1 || most > 1 ? 's' : ''
    switch (type) {
        case 'discardHand':
            return `discard ${numStr} card${s}`
        case 'discardDraw':
            return `discard ${numStr} card${s} from your draw pile`
        case 'removeRoom':
            return `remove ${numStr} card${s} in the draw pile from the room`
        default:
            throw Error('unknown require type:', type)
    }
}

export const execute: Executors['require'] = ({ dslArgs, scene }) => {
    const [type, least, most] = evalAll(dslArgs)
    if (!['discardHand', 'discardDraw', 'removeRoom'].includes(type))
        throw Error(`unknown require type: ${type}`)
    scene.set('requireAction', { type, least, most })
}
