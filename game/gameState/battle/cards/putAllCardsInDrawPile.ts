import produce from 'immer'
import type { BattleCursor } from 'shared'

import { shufflePile } from './shufflePile'

export function putAllCardsInDrawPile(scene: BattleCursor): void {
    scene.apply(
        'cards',
        produce(cards => {
            cards.draw = shufflePile({
                ...cards.draw,
                ...cards.hand,
                ...cards.discard,
            })
        })
    )
}
