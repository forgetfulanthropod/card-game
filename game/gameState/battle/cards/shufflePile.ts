import type { Pile } from 'shared'
import { shuffle } from 'lodash'

import { keys } from '@/util'

export function shufflePile(pile: Pile): Pile {
    let newPile = {}

    shuffle(keys(pile)).forEach(
        pileKey => (newPile = { ...newPile, [pileKey]: pile[pileKey] })
    )

    return newPile
}
