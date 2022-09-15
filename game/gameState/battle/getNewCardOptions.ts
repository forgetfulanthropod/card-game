import { BattleScene, CharacterMeta, NUM_CARD_OPTIONS, Pile } from 'shared'
import { getAllPcs } from './characterGetters'
import {
    getCardInstance,
    getRandomCardIdOfClass,
    updateExplanation,
} from './cards'
import { toCursor } from '@/util'

export const NUM_KAIJUS_IN_PARTY = 3

export function getNewCardOptions(scene: BattleScene): Pile {
    const newPile: Pile = {}
    const allPcs = getAllPcs(scene)
    if (allPcs.length !== NUM_KAIJUS_IN_PARTY)
        throw new Error(
            `party must have exactly ${NUM_KAIJUS_IN_PARTY} kaijus...`
        )

    for (let i = 0; i < NUM_CARD_OPTIONS; i++) {
        const card = updateExplanation(newCard(allPcs, i), toCursor(scene))
        newPile[card.uid] = card
    }

    return newPile
}

function newCard(allPcs: CharacterMeta[], i: number) {
    const character =
        i < NUM_KAIJUS_IN_PARTY
            ? allPcs[i]
            : allPcs[Math.floor(srandom() * allPcs.length)]

    return getCardInstance(
        getRandomCardIdOfClass(character.class),
        character.uid
    )
}
