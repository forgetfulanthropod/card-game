import type { Card, CardId, Cards, CharacterUid } from '@shared'
import { set } from 'lodash'

import type { BattleCursor } from '@/util'
import { keys, vals } from '@/util'

import { explainActionsForCard, getCharIds } from '..'

const basicMagicAttackBase = {
    name: 'Basic Magic Attack',
    energy: 1,
    targetNum: 1,
    targetType: 'enemies',
    actions: 'deal(magic)',
    type: 'attack',
} as const

const basicAttackBase = {
    name: 'Basic Attack',
    energy: 0,
    targetNum: 1,
    targetType: 'enemies',
    actions: 'deal(strength)',
    type: 'attack',
} as const

const blockBase = {
    name: 'Block',
    energy: 1,
    targetNum: 1,
    targetType: 'friends',
    actions: 'addBlock(dexterity)',
    type: 'defense',
} as const

/** Enforces correct self-id */
type CardDefinitionMap = {
    [Key in CardId]: Omit<Card, 'characterUid' | 'explanation'> & { id: Key }
}

const cardDefinitionsMap: CardDefinitionMap = {
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
        // TODO: dwindle
        actions:
            'chain(deal(block), text("(equal to Kauju\'s block)"), dwindle())',
        type: 'attack',
        characterClass: 'knight',
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
        id: 'orbOfLightning',
        targetNum: 1,
        targetType: 'self',
        actions: 'orb("lightning", 3)',
        type: 'enchantment',
        characterClass: 'wizard',
    },
    orbOfProtection: {
        name: 'Orb of Protection',
        energy: 1,
        id: 'orbOfProtection',
        targetNum: 1,
        targetType: 'self',
        actions: 'orb("protection", 3)',
        type: 'enchantment',
        characterClass: 'wizard',
    },
    basicMagicAttackWizard: {
        ...basicMagicAttackBase,
        id: 'basicMagicAttackWizard',
        characterClass: 'wizard',
    },
    basicMagicAttackCleric: {
        ...basicMagicAttackBase,
        id: 'basicMagicAttackCleric',
        characterClass: 'cleric',
    },
    magicRitual: {
        name: 'Magic Ritual',
        energy: 0,
        id: 'magicRitual',
        targetNum: 1,
        targetType: 'self',
        actions: 'addEnergy(2)', // TODO
        type: 'utility',
        characterClass: 'wizard',
    },
    chainLightning: {
        name: 'Chain Lightning',
        energy: 2,
        id: 'chainLightning',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chainAttack(3, 0.75 * magic)', // TODO
        type: 'attack',
        characterClass: 'wizard',
    },
    spellBook: {
        name: 'Spell Book',
        energy: 3,
        id: 'spellBook',
        targetNum: 1,
        actions: 'orb("energy", 1)', // TODO: energy orbs and permanent?
        type: 'enchantment',
        characterClass: 'wizard',
        targetType: 'self',
    },
    fireball: {
        name: 'Fireball',
        energy: 2,
        id: 'fireball',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'deal(magic * 2.5)',
        type: 'attack',
        characterClass: 'wizard',
    },
    arcanePower: {
        name: 'Arcane Power',
        energy: 1,
        id: 'arcanePower',
        targetNum: 1,
        targetType: 'card',
        actions: 'doubleEnchantmentOrToken()', // TODO
        type: 'utility',
        characterClass: 'wizard',
    },
    scatterBrained: {
        name: 'Scatter Brained',
        energy: 1,
        id: 'scatterBrained',
        targetNum: 0,
        targetType: 'self',
        actions: 'chain(draw(3), discard(2))', // TODO
        type: 'utility',
        characterClass: 'wizard',
    },
    magicalStorm: {
        name: 'Magical Storm',
        energy: 1,
        id: 'magicalStorm',
        targetNum: 0,
        targetType: 'self',
        actions: 'increaseThisRound("enemy", "damage", 4)', // TODO
        type: 'utility',
        characterClass: 'wizard',
    },
    orbOfFrost: {
        name: 'Orb of Frost',
        energy: 1,
        id: 'orbOfFrost',
        targetNum: 1,
        targetType: 'self',
        actions: 'orb("frost", 2)',
        type: 'enchantment',
        characterClass: 'wizard',
    },
    basicAttackKnight: {
        ...basicAttackBase,
        id: 'basicAttackKnight',
        characterClass: 'knight',
    },
    basicAttackCleric: {
        ...basicAttackBase,
        id: 'basicAttackCleric',
        characterClass: 'cleric',
    },
    blockKnight: {
        ...blockBase,
        id: 'blockKnight',
        characterClass: 'knight',
    },
    blockCleric: {
        ...blockBase,
        id: 'blockCleric',
        characterClass: 'cleric',
    },
    blockWizard: {
        ...blockBase,
        id: 'blockWizard',
        characterClass: 'wizard',
    },
    swordSlash: {
        name: 'Sword Slash',
        energy: 1,
        id: 'swordSlash',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chainAttack(2, 0.5 * strength)',
        type: 'attack',
        characterClass: 'knight',
    },
    dutifulStab: {
        name: 'Dutiful Stab',
        energy: 1,
        id: 'dutifulStab',
        targetNum: 1,
        targetType: 'enemies',
        // TODO: is fatigue same as debilitate?
        actions: 'chain(deal(strength), ifFirstPlay(debilitate(1)))',
        type: 'attack',
        characterClass: 'knight',
    },
    charge: {
        name: 'Charge',
        energy: 2,
        id: 'charge',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chain(deal(strength), vulnerable(1))',
        type: 'attack',
        characterClass: 'knight',
    },
    tetsudoFormation: {
        name: 'Tetsudo Formation',
        energy: 1,
        id: 'tetsudoFormation',
        targetNum: 1,
        targetType: 'self',
        actions:
            'chain(addBlock(dexterity), increaseThisRound("cards", "block", 0.5 * dexterity))',
        type: 'utility',
        characterClass: 'knight',
    },
    guidingBolt: {
        name: 'Guiding Bolt',
        energy: 2,
        id: 'guidingBolt',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chain(deal(magic), unguarded(2))',
        type: 'attack',
        characterClass: 'cleric',
    },
    smite: {
        name: 'Smite',
        energy: 1,
        id: 'smite',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chain(deal(magic), ifTargetDied(addBlock(dexterity)))',
        type: 'attack',
        characterClass: 'cleric',
    },
    bless: {
        name: 'Bless',
        energy: 2,
        id: 'bless',
        targetNum: 1,
        targetType: 'self',
        actions: 'forTurns(2, addBlock(dexterity * .5))',
        type: 'defense',
        characterClass: 'cleric',
    },
    prayerOfGoodFortune: {
        name: 'Prayer of Good Fortune',
        energy: 0,
        id: 'prayerOfGoodFortune',
        targetNum: 1,
        targetType: 'unknown',
        actions: 'choice(killEnemy(constraint(health < 3)), addBlock(3))',
        type: 'utility',
        characterClass: 'cleric',
    },
    orbOfHolyLight: {
        name: 'Orb of Holy Light',
        energy: 2,
        id: 'orbOfHolyLight',
        targetNum: 1,
        targetType: 'self',
        actions: 'orbOfHolyLight()',
        type: 'enchantment',
        characterClass: 'cleric',
    },
    mantraOfPatience: {
        name: 'Mantra of Patience',
        energy: 1,
        id: 'mantraOfPatience',
        targetNum: 1,
        targetType: 'self',
        actions: 'atNextTurn(addEnergy(2))',
        type: 'utility',
        characterClass: 'cleric',
    },
    helpingHand: {
        name: 'Helping Hand',
        energy: 1,
        id: 'helpingHand',
        targetNum: 1,
        targetType: 'friends',
        actions:
            'choice(addBlock(dexterity + 2), addMagic(magic+2), addAttack(attack+2))',
        type: 'utility',
        characterClass: 'cleric',
    },
}
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
