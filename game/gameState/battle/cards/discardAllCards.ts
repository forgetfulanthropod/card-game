import { BattleCursor } from 'shared'

export function discardAllCards(scene: BattleCursor) {
    scene.apply('cards', cards => {
        const newCards = { ...cards }

        newCards.discard = { ...newCards.discard, ...newCards.hand }

        newCards.hand = {}

        return newCards
    })
}
