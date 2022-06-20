import { set, upperFirst } from 'lodash'
import type {
    Card,
    CardId,
    Piles,
    CharacterUid,
    BattleCursor,
    CharacterClass,
    Pile,
    OwnedCharacterStats,
} from 'shared'

import { keys, vals } from 'shared/code'
import { explainCommand } from './interpretCommand'
import { cardDefinitionsMap } from '@/rulebook'
import type { EntryCursor } from '@/util'

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

export function getNullCards(): Piles {
    return { draw: {}, hand: {}, discard: {}, removedRoom: {}, removedRun: {} }
}

function makeCards(scene: BattleCursor): Piles {
    const cardIds: CardId[] = [
        // 'bodySlam',
        // 'TEST_turnStartEffects',
        // 'magicRitual',
        // 'chainLightning',
        // 'spellBook',
        // 'fireball',
        // 'orbOfFrost',
        // 'basicAttackCleric',
        // 'basicAttackKnight',
        // 'blockCleric',
        // 'blockKnight',
        // 'blockWizard',
        // 'swordSlash',
        // 'dutifulStab',
        // 'charge',
        // 'tetsudoFormation',
        // final cards below?
        // 'arcanePower',
        // 'scatterBrained',
        // 'magicalStorm',
        // 'guidingBolt',
        // 'smite',
        // 'bless',
        // 'prayerOfGoodFortune', // todo
        // 'orbOfHolyLight', // todo
        // 'mantraOfPatience',
        // 'helpingHand',
    ]

    const allCharacters = vals(scene.get('allCharacters'))
    allCharacters.forEach(c => {
        const ccuf = upperFirst(c.class)
        cardIds.push(
            //@ts-expect-error
            `basicAttack${ccuf}`,
            // `basicAttack${ccuf}`,
            `block${ccuf}`
            // `block${ccuf}`,
            // 'helpingHand',
            // 'smite'
        )
        cardIds.push(getRandomCardIdOfClass(c.class))
    })

    return {
        draw: cardIds.reduce((acc, id, i) => {
            // logger.info(JSON.stringify(allCharacters, null, '\n'))
            const owningCharUid =
                allCharacters[Math.floor((i * 3) / cardIds.length)].uid

            const card = updateExplanation(
                getCardInstance(id, owningCharUid),
                scene
            )
            return set(acc, card.uid, card)
        }, {}),
        hand: {},
        discard: {},
        removedRoom: {},
        removedRun: {},
    }
}
/**
 * random but not a basic starter...
 */
export function getRandomCardIdOfClass(characterClass: CharacterClass): CardId {
    const idPool = keys(cardDefinitionsMap).filter(
        cardId => getCardClass(cardId) === characterClass
    )

    let cardId = get()

    while (
        //can't be these..
        ~cardId.indexOf('basicAttack') ||
        ~cardId.indexOf('strike') ||
        ~cardId.indexOf('block')
    ) {
        cardId = get()
    }

    return cardId

    function get() {
        return idPool[Math.floor(srandom() * idPool.length)]
    }
}

/**
 * random but not a basic starter...
 */
export function getFullDeckForCharacter(
    character: OwnedCharacterStats,
    scene: EntryCursor
): Pile {
    const idPool = keys(cardDefinitionsMap).filter(
        cardId => getCardClass(cardId) === character.class
    )

    const pile: Pile = {}

    idPool.forEach(cardId => {
        const card = updateExplanation(
            getCardInstance(cardId, character.uid),
            scene
        )

        pile[card.uid] = card
    })

    return pile
}

export function updateExplanation(
    card: Card,
    scene: BattleCursor | EntryCursor
): Card {
    return { ...card, explanation: explainCommand(card, scene) }
}

export function getCardInstance(id: CardId, characterUid: CharacterUid): Card {
    return {
        ...cardDefinitionsMap[id],
        uid: `${id}-${makeRandId()}`,
        characterUid,
        explanation: 'error!',
    }
}

function makeRandId() {
    return srandom().toString().slice(2)
}

function getCardClass(id: keyof typeof cardDefinitionsMap): CharacterClass {
    return cardDefinitionsMap[id].characterClass
}
