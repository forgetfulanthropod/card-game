import type { Card, CardId, Cards, CharacterUid } from '@shared'
import { set } from 'lodash'

import { cardDefinitionsMap } from '@/rulebook/cardDefinitionsMap'
import type { BattleCursor } from '@shared'
import { keys, vals } from '@/util'

import { explainActionsForCard, getCharIds } from '..'

// TODO: repeated cards: block, basic attack, basic magic attack
// probably want to take characterClass off of the card type?

export function updateHand(scene: BattleCursor) {
    scene.apply(['cards', 'hand'], hand => {
        const newHand = { ...hand }
        keys(hand).forEach(
            cardUid =>
                (newHand[cardUid] = updateExplanation(hand[cardUid], scene))
        )
        return newHand
    })
}

export function setCards(scene: BattleCursor) {
    scene.set('cards', makeCards(scene))
}

export function getNullCards(): Cards {
    return { draw: {}, hand: {}, discard: {}, removed: {} }
}

export function makeCards(scene: BattleCursor): Cards {
    const cardIds: CardId[] = [
        'shield',
        'shield',
        'shield',
        'shieldOfLight',
        'shieldOfLight',
        'shieldOfLight',
        'sweepTheLeg',
        'sweepTheLeg',
        'bodySlam',
        'bodySlam',
        'jab',
        'strike',
        'strike',
        'orbOfLightning',
        'orbOfLightning',
        'orbOfProtection',
        'orbOfProtection',
    ]
    const allPCs = getCharIds(vals(scene.get('allCharacters')), {
        isPc: true,
    })
    const characterUid = allPCs[0]
    return {
        draw: cardIds.reduce(
            (acc, id) =>
                set(
                    acc,
                    `${id}-${srandom().toString().replace('.', '')}`,
                    updateExplanation(getCardInstance(id, characterUid), scene)
                ),
            {}
        ),
        hand: {},
        discard: {},
        removed: {},
    }
}

function updateExplanation(card: Card, scene: BattleCursor): Card {
    return { ...card, explanation: explainActionsForCard(card, scene) }
}

function getCardInstance(
    id: keyof typeof cardDefinitionsMap,
    characterUid: CharacterUid
): Card {
    return { ...cardDefinitionsMap[id], characterUid, explanation: 'error!' }
}
