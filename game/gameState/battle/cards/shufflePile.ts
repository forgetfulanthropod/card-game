import { shuffle } from 'lodash'
import type { Pile } from 'shared'

import { keys } from 'shared/code'

export function shufflePile(pile: Pile): Pile {
    let newPile = {}

    shuffle(keys(pile)).forEach(
        pileKey => (newPile = { ...newPile, [pileKey]: pile[pileKey] })
    )

    return newPile
}
