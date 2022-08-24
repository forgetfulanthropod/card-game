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
    CharacterId,
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
        // 'TEST_turnStartEffects',
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
        // 'testudoFormation',
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
        // 'orbOfProtection',
        // 'orbOfLightning',
    ]

    const allCharacters = vals(scene.get('allCharacters'))
    allCharacters.forEach(cm => {
        const ccuf = upperFirst(cm.class)
        cardIds.push(
            //@ts-expect-error
            // `basicAttack${ccuf}`,
            `basicAttack${ccuf}`,
            `block${ccuf}`
            // `block${ccuf}`,
            // 'helpingHand',
            // 'smite'
            // 'TEST_turnStartEffects'
            // 'magicalStorm',
            // 'parry',
            // 'smite'
        )
        cardIds.push(getFirstCardIdForCharacterId(cm.id))
        if (cm.class === 'wizard') cardIds.push('trance')
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

function getFirstCardIdForCharacterId(characterId: CharacterId): CardId {
    // TODO: no partial when all characters covered..
    const characterIdToCardIdMap: Partial<Record<CharacterId, CardId>> = {
        frogKnight: 'charge',
        mushroomFarmer: 'helpingHand',
        penguinKnight: 'parry',
        skeletonWarrior: 'swordSlash',
        matchaGelatinCube: 'shieldOfLight',
        warhog: 'bodySlam',
        gnomeHooligan: 'gnomeBomb',
        jerry: 'psychicWarfare',
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return characterIdToCardIdMap[characterId]!
}

/**
 * random but not a basic starter...
 */
export function getRandomCardIdOfClass(characterClass: CharacterClass): CardId {
    const idPool = keys(cardDefinitionsMap).filter(
        cardId =>
            getCardClass(cardId) === characterClass &&
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
