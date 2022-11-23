import type { BattleCursor, Pile, Piles } from 'shared'
import { keys } from 'shared/code'
import { cardDefinitionsMap } from '@/rulebook'
import { putAllCardsInDrawPile } from './putAllCardsInDrawPile'
// dwindle, momentary, convalesce,

export function clearRoomCardModifiers(scene: BattleCursor): void {
    putAllCardsInDrawPile(scene)

    scene.apply('cards', (piles): Piles => {
        const draw = { ...piles.draw, ...piles.removedRoom }

        undoDwindle(draw)

        return {
            ...piles,
            removedRoom: {},
            draw,
        }
    })
}

function undoDwindle(pile: Pile) {
    keys(pile).forEach(cardUid => {
        if (pile[cardUid].actions.includes('dwindle')) {
            pile[cardUid] = {
                ...pile[cardUid],
                energy: cardDefinitionsMap[pile[cardUid].id].energy,
            }
        }
    })
}
