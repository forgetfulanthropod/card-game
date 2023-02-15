import type { BattleCursor, CardId, Pile, Piles } from 'shared'
import { keys } from 'shared/code'
import { cardDefinitionsMap } from '@/rulebook'
import { putAllCardsInDrawPile } from './putAllCardsInDrawPile'
// dwindle, momentary, convalesce,

const removeAfterRoom: CardId[] = ['hypnotized']

export function clearRoomCardModifiers(scene: BattleCursor): void {
    putAllCardsInDrawPile(scene)

    scene.apply('cards', (piles): Piles => {
        let draw = { ...piles.draw, ...piles.removedRoom }

        // remove junk cards given to player
        draw = Object.fromEntries(
            Object.entries(draw).filter(
                ([_, card]) => removeAfterRoom.includes(card.id) == false
            )
        )

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
