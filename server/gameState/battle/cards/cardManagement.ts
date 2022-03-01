import type { Card, CardId, Cards, CharacterUid } from '@shared'
import { set } from 'lodash'

import type { BattleCursor } from '@/util'
import { keys, vals } from '@/util'

import { explainActionsForCard, getCharIds } from '..'

const cardDefinitionsMap: Record<
    CardId,
    Omit<Card, 'characterUid' | 'explanation'>
> = {
    shield: {
        name: 'Shield',
        energy: 1,
        id: 'shield',
        targetNum: 1,
        targetType: 'friends',
        actions: 'addBlock(dexterity + 2)',
        type: 'defense',
        characterClass: 'knight',
    },
    shieldOfLight: {
        name: 'Shield of Light',
        energy: 1,
        id: 'shieldOfLight',
        targetNum: 1,
        targetType: 'friends',
        actions: 'addBlock(magic + 3)',
        type: 'defense',
        characterClass: 'cleric',
    },
    sweepTheLeg: {
        name: 'Sweep The Leg',
        energy: 2,
        id: 'sweepTheLeg',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chain(deal(strength), debilitate(1))',
        type: 'attack',
        characterClass: 'knight',
    },
    bodySlam: {
        name: 'Body Slam',
        energy: 1,
        id: 'bodySlam',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chain(deal(block), text("(equal to Kauju\'s block)"))',
        type: 'attack',
        characterClass: 'rogue',
    },
    jab: {
        name: 'Jab',
        energy: 0,
        id: 'jab',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'deal(strength * .5)',
        type: 'attack',
        characterClass: 'bard',
    },
    strike: {
        name: 'Strike',
        energy: 1,
        id: 'strike',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'deal(strength + 2)',
        type: 'attack',
        characterClass: 'knight',
    },
    orbOfLightning: {
        name: 'Orb of Lightning',
        energy: 1,
        id: 'strike',
        targetNum: 1,
        targetType: 'self',
        actions: 'orb("lightning", 3)',
        type: 'enchantment',
        characterClass: 'wizard',
    },
    orbOfProtection: {
        name: 'Orb of Protection',
        energy: 1,
        id: 'strike',
        targetNum: 1,
        targetType: 'self',
        actions: 'orb("protection", 3)',
        type: 'enchantment',
        characterClass: 'wizard',
    },
}

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
