import { set } from 'lodash'
import type {
    Card,
    CardId,
    Cards,
    CharacterUid,
    BattleCursor,
    CharacterClass,
    CardUid,
} from 'shared'

import { keys, vals } from 'shared/code'
import { explainCommand } from './interpretCommand'
import { cardDefinitionsMap } from '@/rulebook'

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

function makeCards(scene: BattleCursor): Cards {
    const cardIds: CardId[] = [
        'guidingBolt',
        'guidingBolt',
        // 'guidingBolt',
        // 'guidingBolt',
        // 'guidingBolt',
        // 'guidingBolt',
        // 'guidingBolt',
        // 'shield',
        // 'shield',
        'shield',
        // 'shieldOfLight',
        // 'shieldOfLight',
        'shieldOfLight',
        'sweepTheLeg',
        'sweepTheLeg',
        'sweepTheLeg',
        'sweepTheLeg',
        'bodySlam',
        // 'bodySlam',
        'jab',
        'strike',
        'strike',
        'orbOfLightning',
        // 'orbOfLightning',
        'orbOfProtection',
        // 'orbOfProtection',
    ]
    const allCharacters = vals(scene.get('allCharacters'))

    return {
        draw: cardIds.reduce((acc, id) => {
            // logger.info(JSON.stringify(allCharacters, null, '\n'))
            let firstCharacterUidForClass = allCharacters.find(
                c => c?.class === getCardClass(id)
            )?.uid

            if (firstCharacterUidForClass == null) {
                logger.info(
                    'TODO: no character class matches this card, going with character 0'
                )
                firstCharacterUidForClass = allCharacters[0].uid
            }

            const cardUid = `${id}-${srandom().toString().replace('.', '')}`
            return set(
                acc,
                cardUid,
                updateExplanation(
                    getCardInstance(id, cardUid, firstCharacterUidForClass),
                    scene
                )
            )
        }, {}),
        hand: {},
        discard: {},
        removed: {},
    }
}

function updateExplanation(card: Card, scene: BattleCursor): Card {
    return { ...card, explanation: explainCommand(card, scene) }
}

function getCardInstance(
    id: keyof typeof cardDefinitionsMap,
    uid: CardUid,
    characterUid: CharacterUid
): Card {
    return {
        ...cardDefinitionsMap[id],
        uid,
        characterUid,
        explanation: 'error!',
    }
}

function getCardClass(id: keyof typeof cardDefinitionsMap): CharacterClass {
    return cardDefinitionsMap[id].characterClass
}
