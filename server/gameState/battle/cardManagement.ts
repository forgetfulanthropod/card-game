import type { Cards, OwnedCharacter } from '@shared'

export function makeCards(
    _chosen: OwnedCharacter[] = [],
    _username: string
): Cards {
    return {
        draw: {
            uuid1: {
                name: 'string',
                url: './Sweep The Leg.png',
                text: ['string'],
                definitions: ['string'],
                type: 'string',
                characterClass: 'string',
                deckId: 'string',
            },
        },
        hand: {
            uuid2: {
                name: 'string',
                url: './Sweep The Leg.png',
                text: ['string'],
                definitions: ['string'],
                type: 'string',
                characterClass: 'string',
                deckId: 'string',
            },
        },
        discard: {
            uuid3: {
                name: 'string',
                url: './Sweep The Leg.png',
                text: ['string'],
                definitions: ['string'],
                type: 'string',
                characterClass: 'string',
                deckId: 'string',
            },
        },
        removed: {
            uuid3: {
                name: 'string',
                url: './Sweep The Leg.png',
                text: ['string'],
                definitions: ['string'],
                type: 'string',
                characterClass: 'string',
                deckId: 'string',
            },
        },
    }
}
