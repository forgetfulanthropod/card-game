import type { Card, CardId } from 'shared'

// cardDefinitionsMap
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
export const cardDefinitionsMap: CardDefinitionMap = {
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
        actions: 'chain(addEnergy(2), momentary())',
        type: 'utility',
        characterClass: 'wizard',
    },
    chainLightning: {
        name: 'Chain Lightning',
        energy: 2,
        id: 'chainLightning',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chainAttack(3, 0.75 * magic)',
        type: 'attack',
        characterClass: 'wizard',
    },
    spellBook: {
        name: 'Spell Book',
        energy: 3,
        id: 'spellBook',
        targetNum: 1,
        actions: 'orb("energy", 1)',
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
        targetType: ['orb', 'cardAttack', 'cardEnchantment'],
        actions: 'doubleEnchantmentOrToken()',
        type: 'utility',
        characterClass: 'wizard',
    },
    scatterBrained: {
        name: 'Scatter Brained',
        energy: 1,
        id: 'scatterBrained',
        targetNum: 0,
        targetType: 'self',
        actions: 'chain(draw(3), discard(2))',
        type: 'utility',
        characterClass: 'wizard',
    },
    magicalStorm: {
        name: 'Magical Storm',
        energy: 1,
        id: 'magicalStorm',
        targetNum: 0,
        targetType: 'self',
        // round.enemyDamageBonus += 4
        // if (blockBroken) health -= (damage + round.enemyDamageBonus)
        actions: 'roundBuff("enemyDamageBonus", 4)',
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
        targetType: [
            { type: 'friends' },
            {
                type: 'enemies',
                constraint: { key: 'health', comparator: '<=', value: 3 },
            },
        ],
        actions:
            'chain(choice(killEnemy(constraint(health < 3)), addBlock(3)), momentary())',
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
        actions: 'chain(atNextTurn(addEnergy(2)), momentary())',
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

// TODO: dwindle, vulnerable, fatigue, unguarded, momentary
// Dwindle:  Increase its cost by 1 every time you play it (till the end of the dungeon room).
// Momentary:  Like Exhaust, but only goes away until the end of the room, not the run.
// Vulnerable (Debuff): Vulnerable characters receive 50% more damage.
// Fatigue (Debuff):  Characters with fatigue deal 25% less damage.
// Unguarded (Debuff): Unguarded characters receive 25% more damage.

/*
round:
    inEffect: ActiveEffect
    buffs:[]
    draw:[]
    hand:[
        {
            id: 'somecard'
            buffs: []
        }
    ]
    discard:[]
    orbs:
        buffs:[]
        kind:''
        val:4
    characters:

ActiveEffect:
    step()
    isDone()

*/
