import {
    BattleScene,
    CharacterMeta,
    NUM_DRAFT_CARD_OPTIONS,
    Pile,
} from 'shared'
import { getAllPcs, getLivingPcs } from '../characters/characterGetters'
import {
    getCardInstance,
    getRandomCardIdForCharacter,
    updateExplanation,
} from '.'
import { toCursor } from '@/util'

export function getNewCardOptions(scene: BattleScene): Pile {
    const newPile: Pile = {}
    const livingPcs = getLivingPcs(scene)

    for (let i = 0; i < livingPcs.length; i++) {
        const card = updateExplanation(newCard(livingPcs, i), toCursor(scene))
        newPile[card.uid] = card
    }

    return newPile
}

function newCard(characters: CharacterMeta[], i: number) {
    const character =
        i < characters.length
            ? characters[i]
            : characters[Math.floor(srandom() * characters.length)]

    return getCardInstance(
        getRandomCardIdForCharacter(character),
        character.uid
    )
}
