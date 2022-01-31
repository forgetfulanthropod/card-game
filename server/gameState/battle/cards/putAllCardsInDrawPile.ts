import type { BattleCursor } from '@/util'

import { shufflePile } from './shufflePile'

export function putAllCardsInDrawPile(scene: BattleCursor): void {
    scene.apply('cards', cards => {
        //TODO: remove impermanents?
        return {
            draw: shufflePile({
                ...cards.draw,
                ...cards.hand,
                ...cards.discard,
            }),
            hand: {},
            discard: {},
            removed: {},
        }
    })
}
