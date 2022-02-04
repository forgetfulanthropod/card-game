import type {
    Card,
    CardId,
    Cards,
    CharacterUid,
    OwnedCharacterStats,
} from '@shared'

const cardDefinitionsMap: Record<CardId, Omit<Card, 'characterUid'>> = {
    shield: {
        name: 'Shield',
        energy: 1,
        id: 'shield',
        targetNum: 1,
        targetType: 'friends',
        actions: 'addBlock(dexterity + 2)',
        text: ['string'],
        definitions: ['string'],
        type: 'string',
        characterClass: 'string',
        deckId: 'string',
    },
    shieldOfLight: {
        name: 'Shield of Light',
        energy: 1,
        id: 'shieldOfLight',
        targetNum: 1,
        targetType: 'friends',
        actions: 'addBlock(magic + 3)',
        text: ['string'],
        definitions: ['string'],
        type: 'string',
        characterClass: 'string',
        deckId: 'string',
    },
    sweepTheLeg: {
        name: 'Sweep The Leg',
        energy: 2,
        id: 'sweepTheLeg',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chain(deal(strength), debilitate(1))',
        text: ['string'],
        definitions: ['string'],
        type: 'string',
        characterClass: 'string',
        deckId: 'string',
    },
    bodySlam: {
        name: 'Body Slam',
        energy: 1,
        id: 'bodySlam',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'deal(block)',
        text: ['string'],
        definitions: ['string'],
        type: 'string',
        characterClass: 'string',
        deckId: 'string',
    },
    jab: {
        name: 'Jab',
        energy: 0,
        id: 'jab',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'deal(strength * .5)',
        text: ['string'],
        definitions: ['string '],
        type: 'string',
        characterClass: 'string',
        deckId: 'string',
    },
    strike: {
        name: 'Strike',
        energy: 1,
        id: 'strike',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'deal(strength + 2)',
        text: ['string'],
        definitions: ['string '],
        type: 'string',
        characterClass: 'string',
        deckId: 'string',
    },
}

export function makeCards(
    chosen: OwnedCharacterStats[] = [],
    _username: string
): Cards {
    const characterUid = chosen[0].uid
    return {
        draw: {
            uuid11: getCardInstance('shield', characterUid),
            uuid12: getCardInstance('shield', characterUid),
            uuid22: getCardInstance('shieldOfLight', characterUid),
            uuid23: getCardInstance('shieldOfLight', characterUid),
            uuid24: getCardInstance('sweepTheLeg', characterUid),
            uuid25: getCardInstance('sweepTheLeg', characterUid),
            uuid26: getCardInstance('sweepTheLeg', characterUid),
            uuid27: getCardInstance('bodySlam', characterUid),
            uuid28: getCardInstance('bodySlam', characterUid),
            uuid29: getCardInstance('jab', characterUid),
            uuid30: getCardInstance('jab', characterUid),
            uuid31: getCardInstance('strike', characterUid),
            uuid32: getCardInstance('strike', characterUid),
        },
        hand: {},
        discard: {},
        removed: {},
    }
}

function getCardInstance(
    id: keyof typeof cardDefinitionsMap,
    characterUid: CharacterUid
): Card {
    return { ...cardDefinitionsMap[id], characterUid }
}
