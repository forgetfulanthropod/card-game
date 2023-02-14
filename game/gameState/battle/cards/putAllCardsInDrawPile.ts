import type { BattleCursor } from 'shared'

import { shufflePile } from './shufflePile'

export function putAllCardsInDrawPile(scene: BattleCursor): void {
    scene.apply('cards', cards => {
        return {
            draw: shufflePile({
                ...cards.draw,
                ...cards.hand,
                ...cards.discard,
            }),
            hand: {},
            discard: {},
            removedRoom: cards.removedRoom,
            removedRun: cards.removedRun,
        }
    })
}
