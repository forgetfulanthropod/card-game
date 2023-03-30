import { upperFirst } from 'lodash'
import type {
    Card,
    CardId,
    Piles,
    CharacterUid,
    BattleCursor,
    CharacterClass,
    Pile,
    OwnedCharacterStats,
    CharacterId,
    CharacterMeta,
    CommandOutcome,
} from 'shared'

import { keys, mapToObj, vals } from 'shared/code'
import { explainCommand, simulateCommand } from './interpretCommand'
import { cardDefinitionsMap } from '@/rulebook'
import { EntryCursor, srandInt } from '@/util'
import { shufflePile } from './shufflePile'
import { getTargetUids } from './getTargetUids'

function getCardOutcomes(
    scene: BattleCursor,
    card: Card
): Record<string, CommandOutcome> | undefined {
    const targetUids = getTargetUids({
        card,
        targetUids: [],
        scene,
    })
    let ac = scene.get('allCharacters')
    let commandOutcomes
    if (targetUids.length) {
        const commandDetail = {
            command: card,
            targetUids,
            scene,
        }
        const [commandOutcome] = simulateCommand(commandDetail)
        return { outcome: commandOutcome }
    }
    if (card.targetNum == 1) {
        commandOutcomes = Object.fromEntries(
            Object.entries(ac).map(([cuid, cm]) => {
                const commandDetail = {
                    command: card,
                    targetUids: [cuid],
                    scene,
                }
                const [commandOutcome] = simulateCommand(commandDetail)
                return [cuid, commandOutcome]
            })
        )
    }
    return commandOutcomes
}

export function updateHand(scene: BattleCursor) {
    scene.apply(['cards', 'hand'], hand => {
        const newHand = {} as typeof hand

        const characterUidsToYPositionMap: Record<CharacterUid, number> = {}
        vals(scene.get('allCharacters')).forEach(
            c => (characterUidsToYPositionMap[c.uid] = c.y)
        )
        const yOf = (uid: CharacterUid) => characterUidsToYPositionMap[uid]

        keys(hand)
            .sort((cardAUid, cardBUid) => {
                return yOf(hand[cardAUid].characterUid) <
                    yOf(hand[cardBUid].characterUid)
                    ? -1
                    : 1
            })
            .forEach(cardUid => {
                const card = hand[cardUid]
                let commandOutcomes = getCardOutcomes(scene, card)
                newHand[cardUid] = {
                    ...updateExplanations(hand[cardUid], scene),
                    outcomes: commandOutcomes,
                }
                return newHand[cardUid]
            })
        return newHand
    })
}

export function setCards(scene: BattleCursor) {
    scene.set('cards', makeCards(scene))
}

export function getNullCards(): Piles {
    return { draw: {}, hand: {}, discard: {}, removedRoom: {}, removedRun: {} }
}

export function makeCards(scene: BattleCursor): Piles {
    const allCharacters = vals(scene.get('allCharacters'))

    const characterUidToCardIdMap: Record<CharacterUid, CardId[]> = {}

    allCharacters.forEach(cm => {
        characterUidToCardIdMap[cm.uid] = []
        const cardIds = characterUidToCardIdMap[cm.uid]
        const ccuf = upperFirst(cm.class)
        cardIds.push(
            //@ts-expect-error
            `basicAttack${ccuf}`,
            `block${ccuf}`
            // 'leadRazor'
            // `block${ccuf}`,
            // `block${ccuf}`,
            // 'helpingHand',
            // 'smite'
            // 'leadRazor'
            // 'magicalStorm',
            // 'parry',
            // 'smite'
            // 'catchTheKnife',
            // 'cowardlyTactics',
            // 'throwingKnife',
            // 'retreatToTheShadows',
            // 'poisonedBlade',
            // 'exponentialIllness',
            // 'twistTheKnife',
            // 'flashbang'
        )

        // DEBUG: give them all cards at once
        // getCardIdsForCharacterId(cm.id).forEach(cardId => cardIds.push(cardId))

        // getCardIdsForCharacterClass(cm.class).forEach(cardId =>
        //     cardIds.push(cardId)
        // )
        // END DEBUG

        getFirstCardIdForCharacterId(cm.id) &&
            cardIds.push(getFirstCardIdForCharacterId(cm.id))

        if (cm.class === 'wizard')
            cardIds.push(
                ['orbOfLightning', 'orbOfFrost', 'zap'][
                    srandInt(0, 2)
                ] as CardId
            )
        if (cm.class === 'cleric') cardIds.push('shieldOfHolyLight')
        if (cm.class === 'knight') cardIds.push('dutifulStab')
        if (cm.class === 'rogue') cardIds.push('patientAmbush')
    })

    const draw: Pile = {}

    keys(characterUidToCardIdMap).forEach(characterUid => {
        const cardIds = characterUidToCardIdMap[characterUid]

        cardIds.forEach(id => {
            const card = updateExplanations(
                getCardInstance(id, characterUid),
                scene
            )

            draw[card.uid] = card
        })
    })

    return {
        draw: shufflePile(draw),
        // draw: cardIds.reduce((acc, id, i) => {
        //     // logger.info(JSON.stringify(allCharacters, null, '\n'))
        //     const owningCharUid =
        //         allCharacters[Math.floor((i * 3) / cardIds.length)].uid

        //     const card = updateExplanation(
        //         getCardInstance(id, owningCharUid),
        //         scene
        //     )
        //     return set(acc, card.uid, card)
        // }, {}),
        hand: {},
        discard: {},
        removedRoom: {},
        removedRun: {},
    }
}

function getCardIdsForCharacterClass(characterClass: CharacterClass): CardId[] {
    return keys(cardDefinitionsMap).filter(
        cardId => cardDefinitionsMap[cardId].characterClass === characterClass
    )
}

function getCardIdsForCharacterId(characterId: CharacterId): CardId[] {
    return keys(cardDefinitionsMap).filter(
        cardId => cardDefinitionsMap[cardId].characterClass === characterId
    )
}

function getFirstCardIdForCharacterId(characterId: CharacterId): CardId {
    // TODO: no partial when all characters covered..
    const characterIdToCardIdMap: Partial<Record<CharacterId, CardId>> = {
        frogKnight: 'charge',
        mushroomFarmer: 'helpingHand',
        notoriousBean: 'beanNeverMisses',
        penguinKnight: 'parry',
        skeletonWarrior: 'swordSlash',
        matchaGelatinCube: 'shieldOfHolyLight',
        gnomeHooligan: 'gnomeBomb',
        jerry: 'psychicWarfare',
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return characterIdToCardIdMap[characterId]!
}

/**
 * random but not a basic starter...
 */
export function getRandomCardIdForCharacter(cm: CharacterMeta): CardId {
    const idPool = keys(cardDefinitionsMap).filter(
        cardId =>
            (getCardClass(cardId) === cm.class ||
                getCardClass(cardId) === cm.id) &&
            !~cardId.indexOf('basicAttack') &&
            !~cardId.indexOf('strike') &&
            !~cardId.indexOf('block')
    )

    return idPool[Math.floor(srandom() * idPool.length)]
}

/**
 * random but not a basic starter...
 */
export function getFullDeckForCharacter(
    character: OwnedCharacterStats,
    scene: EntryCursor
): Pile {
    const idPool = keys(cardDefinitionsMap).filter(
        cardId =>
            getCardClass(cardId) === character.class ||
            getCardClass(cardId) === character.id
    )

    const pile: Pile = {}

    idPool.forEach(cardId => {
        const card = updateExplanations(
            getCardInstance(cardId, character.uid),
            scene
        )

        pile[card.uid] = card
    })

    return pile
}

export function updateExplanations(
    card: Card,
    scene: BattleCursor | EntryCursor
): Card {
    return {
        ...card,
        explanation: explainCommand(card, scene),
        stanceExplanations: {
            avoidant: explainCommand(card, scene, 'avoidant'),
            neutral: explainCommand(card, scene, 'neutral'),
            aggressive: explainCommand(card, scene, 'aggressive'),
        },
    }
}

export function getCardInstance(id: CardId, characterUid: CharacterUid): Card {
    return {
        ...cardDefinitionsMap[id],
        uid: `${id}-${makeRandId()}`,
        characterUid,
        explanation: 'error!',
        stanceExplanations: {
            avoidant: 'error!',
            neutral: 'error!',
            aggressive: 'error!',
        },
    }
}

function makeRandId() {
    return srandom().toString().slice(2)
}

function getCardClass(id: keyof typeof cardDefinitionsMap) {
    return cardDefinitionsMap[id].characterClass
}
