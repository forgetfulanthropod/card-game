import type { CardDefinition, CardId } from 'shared'

const basicMagicAttackBase = {
    name: 'Magic Attack',
    energy: 1,
    targetNum: 1,
    targetType: 'enemies',
    actions: 'deal(magic)',
    type: 'attack',
} as const
const basicAttackBase = {
    name: 'Attack',
    energy: 1,
    targetNum: 1,
    targetType: 'enemies',
    actions: 'deal(strength)',
    type: 'attack',
} as const
const blockBase = {
    name: 'Shield',
    energy: 1,
    targetNum: 1,
    targetType: 'friends',
    actions: 'addBlock(defense)',
    type: 'defense',
} as const
/** Enforces correct self-id */
type CardDefinitionsMap = {
    [Id in CardId]: CardDefinition & { id: Id }
}

export const cardDefinitionsMap: CardDefinitionsMap = {
    leadRazor: {
        name: 'Lead Razor',
        id: 'leadRazor',
        energy: 1,
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'strengthy = strength * .2; chain(deal(strengthy), effect("bleed", 2), effect("poisoned", 5), effect("fatigued", 1))',
        type: 'attack',
        characterClass: 'rogue',
    },
    shieldOfLight: {
        name: 'Shield of Light',
        energy: 1,
        id: 'shieldOfLight',
        targetNum: 1,
        targetType: 'friends',
        actions:
            'magicaldefensey = magic * 0.5 + defense; addBlock(magicaldefensey)',
        type: 'defense',
        characterClass: 'cleric',
    },
    sweepTheLeg: {
        name: 'Sweep The Leg',
        energy: 2,
        id: 'sweepTheLeg',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'strengthy = strength * 1.2; chain(deal(strengthy), effect("debilitated",2), effect("unguarded",2))',
        type: 'attack',
        characterClass: 'knight',
    },
    bodySlam: {
        name: 'Shield Bash',
        energy: 1,
        id: 'bodySlam',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chain(deal(block), "(equal to block)")', // , dwindle()
        type: 'attack',
        characterClass: 'knight',
    },
    jab: {
        name: 'Jab',
        energy: 0,
        id: 'jab',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'strengthy = strength * .5; deal(strengthy)',
        type: 'attack',
        characterClass: 'bard',
    },
    strike: {
        name: 'Attack',
        energy: 1,
        id: 'strike',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'deal(strength)',
        type: 'attack',
        characterClass: 'knight',
    },
    zap: {
        name: 'Zap!',
        energy: 2,
        id: 'zap',
        targetNum: -1,
        targetType: 'allEnemies',
        actions:
            'magical = magic * .4; chain(deal(magical), effect("vulnerable", 1))',
        type: 'enchantment',
        characterClass: 'wizard',
    },
    // Target enemy receives Stun (1).  All enemies gain Debilitated (1) and Unguarded (1) .  Momentary
    flashBang: {
        name: 'Flash Bang',
        energy: 2,
        id: 'flashBang',
        targetNum: 1,
        targetType: 'enemies',
        actions: `chain(
            effect("stunned", 1),
            effectAll("debilitated", 1),
            effectAll("vulnerable", 1),
            momentary()
        )`,
        type: 'utility',
        characterClass: 'rogue',
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
    basicAttackWizard: {
        ...basicMagicAttackBase,
        id: 'basicAttackWizard',
        characterClass: 'wizard',
    },
    basicAttackBard: {
        ...basicMagicAttackBase,
        id: 'basicAttackBard',
        characterClass: 'bard',
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
        targetNum: 3,
        targetType: 'enemies',
        actions: 'magical = 0.75 * magic; deal(magical, 3)',
        type: 'attack',
        characterClass: 'wizard',
    },
    spellBook: {
        name: 'Spell Book',
        energy: 2,
        id: 'spellBook',
        targetNum: 1,
        targetType: 'self',
        actions: 'chain(addEnergyPerRound(1), momentary())',
        type: 'enchantment',
        characterClass: 'wizard',
    },
    fireball: {
        name: 'Fireball',
        energy: 2,
        id: 'fireball',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'magical = magic * 2.5; deal(magical)',
        type: 'attack',
        characterClass: 'wizard',
    },
    /**Target Attack Card, enchantment or ~~token~~ orb doubles the amount of damage it deal this turn. */
    // arcanePower: {
    //     name: 'Arcane Power',
    //     energy: 1,
    //     id: 'arcanePower',
    //     targetNum: 1,
    //     targetType: ['orb', 'cardAttack', 'cardEnchantment'],
    //     actions: 'doubleEnchantmentOrToken()',
    //     type: 'utility',
    //     characterClass: 'wizard',
    // },
    scatterBrained: {
        name: 'Scatter Brained',
        energy: 1,
        id: 'scatterBrained',
        targetNum: 0,
        targetType: 'self',
        actions: 'draw(3)',
        // actions: 'chain(draw(3), require("discardHand", 2, 2))',
        type: 'utility',
        characterClass: 'wizard',
    },
    trance: {
        name: 'Trance',
        energy: 1,
        id: 'trance',
        targetNum: 0,
        targetType: 'self',
        actions: 'chain(effect("entranced", 5), momentary())',
        type: 'utility',
        characterClass: 'wizard',
    },
    // coldTrance: {
    //     name: 'Super Trance',
    //     energy: 1,
    //     id: 'trance',
    //     targetNum: 0,
    //     targetType: 'self',
    //     actions: 'chain(effect("entranceed", 2), orb("frost", 2))',
    //     type: 'utility',
    //     characterClass: 'wizard',
    // },
    orbOfFrost: {
        name: 'Orb of Frost',
        energy: 1,
        id: 'orbOfFrost',
        targetNum: 1,
        targetType: 'self',
        actions: 'orb("frost", 3)',
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
    basicAttackRogue: {
        ...basicAttackBase,
        id: 'basicAttackRogue',
        characterClass: 'rogue',
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
    blockRogue: {
        ...blockBase,
        id: 'blockRogue',
        characterClass: 'rogue',
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
        actions:
            'strengthy = 0.5 * strength; chain(deal(strengthy), effect("bleed", 2))',
        type: 'attack',
        characterClass: 'knight',
    },
    parry: {
        name: 'Parry',
        energy: 1,
        id: 'parry',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'strengthy = 0.75 * strength; defensey = defense * 0.5; chain(deal(strengthy),addBlockToSelf(defensey))',
        type: 'attack',
        characterClass: 'knight',
    },
    berserk: {
        name: 'Berserk',
        energy: 1,
        id: 'berserk',
        targetNum: 1,
        targetType: 'self',
        actions: 'chain(effect("berserk",3), momentary())',
        type: 'enchantment',
        characterClass: 'rogue',
    },
    patientAmbush: {
        name: 'Patient Ambush',
        energy: 1,
        id: 'patientAmbush',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'queue(1, strengthy = strength * 2; ifStance("avoidant", dealFromStance("avoidant", strengthy)))',
        type: 'attack',
        characterClass: 'rogue',
    },
    stab: {
        name: 'Stab',
        energy: 1,
        id: 'stab',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'strengthy = strength + 1; chain(deal(strengthy), effect("bleed", 2), effect("vulnerable", 1))',
        type: 'attack',
        characterClass: 'rogue',
    },
    // catchTheKnife: {
    //     name: 'Catch The Knife',
    //     energy: 1,
    //     id: 'catchTheKnife',
    //     targetNum: 1,
    //     targetType: 'self',
    //     actions: 'effect("knifeCatcher", 1)', //todo
    //     type: 'enchantment',
    //     characterClass: 'rogue',
    // },
    // cowardlyTactics: {
    //     name: 'Cowardly Tactics',
    //     energy: 1,
    //     id: 'cowardlyTactics',
    //     targetNum: 1,
    //     targetType: 'self',
    //     actions: 'effect("cowardlyTactics", 1)', //todo
    //     type: 'enchantment',
    //     characterClass: 'rogue',
    // },
    // throwingKnife: {
    //     name: 'Throwing Knife',
    //     energy: 1,
    //     id: 'throwingKnife',
    //     targetNum: 1,
    //     targetType: 'enemies',
    //     actions:
    //         'strengthy = strength * .5; chain(deal(strengthy), ifKilled(returnCardToHand()))', //todo
    //     type: 'attack',
    //     characterClass: 'rogue',
    // },
    // retreatToTheShadows: {
    //     name: 'Retreat To The Shadows',
    //     energy: 1,
    //     id: 'retreatToTheShadows',
    //     targetNum: 1,
    //     targetType: 'self',
    //     actions: 'toStance("avoidant")', //todo
    //     type: 'utility',
    //     characterClass: 'rogue',
    // },
    poisonedBlade: {
        name: 'Poisoned Blade',
        energy: 1,
        id: 'poisonedBlade',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'strengthy = strength * .6; chain(deal(strengthy), effect("poisoned", 5))',
        type: 'utility',
        characterClass: 'rogue',
    },
    // exponentialIllness: {
    //     name: 'Exponential Illness',
    //     energy: 1,
    //     id: 'exponentialIllness',
    //     targetNum: 1,
    //     targetType: 'self',
    //     actions: 'exponentialIllness(3)', //todo
    //     type: 'utility',
    //     characterClass: 'rogue',
    // },
    // twistTheKnife: {
    //     name: 'Twist The Knife',
    //     energy: 1,
    //     id: 'twistTheKnife',
    //     targetNum: 1,
    //     targetType: 'self',
    //     actions:
    //         'strengthy1 = 1.25 * strength; strengthy2 = .75; chain(deal(strengthy1), ifHealth("less than", .5, deal(strengthy2)))', //todo
    //     type: 'attack',
    //     characterClass: 'rogue',
    // },
    // flashbang: {
    //     name: 'Flashbang',
    //     energy: 2,
    //     id: 'flashbang',
    //     targetNum: 'all',
    //     targetType: 'enemies',
    //     actions:
    //         'chain(effect("stunned", 1), effect("debilitated", 1), effect("unguarded", 1), momentary())', //todo
    //     type: 'attack',
    //     characterClass: 'rogue',
    // },
    // songOfCourage: {
    //     name: 'Song Of Courage',
    //     energy: 2,
    //     id: 'songOfCourage',
    //     targetNum: 1,
    //     targetType: 'self',
    //     actions: 'effect("melody", 2)', //todo
    //     type: 'enchantment',
    //     characterClass: 'bard',
    // },
    dutifulStab: {
        name: 'Dutiful Stab',
        energy: 1,
        id: 'dutifulStab',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'chain(deal(strength), effect("debilitated",1))',
        type: 'attack',
        characterClass: 'knight',
    },
    charge: {
        name: 'Charge',
        energy: 2,
        id: 'charge',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'strengthy = strength * 1.6; chain(deal(strengthy), effect("vulnerable", 2))',
        type: 'attack',
        characterClass: 'knight',
    },
    testudoFormation: {
        name: 'Testudo Formation',
        energy: 1,
        id: 'testudoFormation',
        targetNum: 1,
        targetType: 'friends',
        // TODO: "You may only play this card if this character is in an avoidant stance."
        actions: 'chain(addBlock(defense), effect("strongblock", 1))',
        type: 'utility',
        characterClass: 'knight',
    },
    guidingBolt: {
        name: 'Guiding Bolt',
        energy: 2,
        id: 'guidingBolt',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'magical = magic * 2; chain(deal(magical), effect("unguarded", 3))',
        type: 'attack',
        characterClass: 'cleric',
    },
    gnomeBomb: {
        name: 'Gnome Bomb',
        energy: 0,
        id: 'gnomeBomb',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'strengthymagical = strength * .5 + magic * .5; chain(deal(strengthymagical), dwindle())',
        type: 'attack',
        characterClass: 'rogue',
    },
    smite: {
        name: 'Smite',
        energy: 1,
        id: 'smite',
        targetNum: 1,
        targetType: 'enemies',
        actions: 'smite(magic, defense)',
        type: 'attack',
        characterClass: 'cleric',
    },
    bless: {
        name: 'Bless',
        energy: 1,
        id: 'bless',
        targetNum: -1,
        targetType: 'allFriends',
        actions:
            'chain(effectAll("courageous", 1), effectAll("strongblock", 2))',
        type: 'defense',
        characterClass: 'cleric',
    },
    // prayerOfGoodFortune: {
    //     name: 'Prayer of Good Fortune',
    //     energy: 0,
    //     id: 'prayerOfGoodFortune',
    //     targetNum: 1,
    //     targetType: [
    //         { type: 'friends' },
    //         {
    //             type: 'enemies',
    //             constraint: { key: 'health', comparator: '<=', value: 3 },
    //         },
    //     ],
    //     actions:
    //         'chain(targetSwitch(["friend", addBlock(3)], ["enemy", killIf(targetHealth < 4)]), momentary())',
    //     type: 'utility',
    //     characterClass: 'cleric',
    // },
    psychicWarfare: {
        name: 'Psychic Warfare',
        energy: 0,
        id: 'psychicWarfare',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'magical1 = magic * .75; magical2 = magic * .33; chain(psychicWarfare(magical1,magical2), dwindle())',
        type: 'attack',
        characterClass: 'wizard',
    },
    orbOfHolyLight: {
        name: 'Orb of Holy Light',
        energy: 2,
        id: 'orbOfHolyLight',
        targetNum: 1,
        targetType: 'self',
        actions: 'orb("holyLight", 3)',
        type: 'enchantment',
        characterClass: 'cleric',
    },
    mantraOfPatience: {
        name: 'Mantra of Patience',
        energy: 1,
        id: 'mantraOfPatience',
        targetNum: 1,
        targetType: 'self',
        actions: 'chain(draw(1), queue(1, addEnergy(2)), momentary())',
        type: 'utility',
        characterClass: 'cleric',
    },
    helpingHand: {
        name: 'Helping Hand',
        energy: 1,
        id: 'helpingHand',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            chain(
                addBlock(defense),
                modifyStats("strength|magic", "2|2", "room")
            )`,
        type: 'utility',
        characterClass: 'cleric',
    },
    ancientVerse: {
        name: 'Ancient Verse',
        energy: 1,
        id: 'ancientVerse',
        targetNum: -1,
        targetType: 'allFriends',
        actions: `
            chain(
                modifyStats("strength|magic", "2|2", "room", "allFriends")
            )`,
        type: 'utility',
        characterClass: 'cleric',
    },
    momentOfClarity: {
        name: 'Moment Of Clarity',
        energy: 1,
        id: 'momentOfClarity',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            defensey = 0.75 * defense;
            chain(
                removeAllDebuffs(),
                modifyStats("strength|magic", "6|6", "turn"),
                addBlock(defensey),
                momentary()
            )`,
        type: 'utility',
        characterClass: 'cleric',
    },
    enchantedStrike: {
        name: 'Enchanted Strike',
        energy: 1,
        id: 'enchantedStrike',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            strengthymagicy = 0.65 * magic + 0.6 * strength;
            deal(strengthymagicy)
        `,
        type: 'attack',
        characterClass: 'cleric',
    },
    songOfTheBrazen: {
        name: 'Song of the Brazen',
        energy: 0,
        id: 'songOfTheBrazen',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            strengthy1 = strength * .35;
            magicy1 = magic * .35;
            strengthy2 = strength * .5;
            magicy2 = magic * .5;
            ifStance(
              "aggressive",
                modifyStats(
                    "turn",
                    "friends",
                    "strength",
                    strengthy1,
                    "magic",
                    magicy1
                ),
                modifyStats(
                   "turn",
                   "friends",
                   "strength",
                   strengthy2,
                   "magic",
                   magicy2
                 ),
             )`,
        type: 'utility',
        characterClass: 'bard',
    },
    songOfGoodHealth: {
        name: 'Song of Good Health',
        energy: 1,
        id: 'songOfGoodHealth',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            strenghtymagicy = 0.5 * strength + 0.5 * magic;
            magicy = .35 * magic;
            chain(
                addBlock(strengthymagicy);
                heal(magicy);
            )`,
        type: 'utility',
        characterClass: 'bard',
    },
    songOfTheWarrior: {
        name: 'Song of the Warrior',
        energy: 1,
        id: 'songOfTheWarrior',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            strengthy1 = strength;
            strengthy2 = 0.75 * strength;
            chain(
                modifyStats(strengthy1);
                addBlock(strengthy2);
            )`,
        type: 'utility',
        characterClass: 'bard',
    },
    songOfWizadry: {
        name: 'Song of Wizadry',
        energy: 1,
        id: 'songOfWizadry',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            magicy1 = strength;
            magicy2 = 0.75 * strength;
            chain(
                modifyStats(magicy1);
                addBlock(magicy2);
            )`,
        type: 'utility',
        characterClass: 'bard',
    },
    songOfTheHuntsman: {
        name: 'Song of the Huntsman',
        energy: 2,
        id: 'songOfTheHuntsman',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            chain(
                effect(stun,1);
                effect(ignoreBlock,1);
            )`,
        type: 'utility',
        characterClass: 'bard',
    },
    songOfFortitude: {
        name: 'Song of Fortitude',
        energy: 1,
        id: 'songOfFortitude',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            defenceymagicky = 0.5 * defence + 0.5 * magic;
            chain(
                addBlock(defenceymagicy);
                effect(guarded,2);
                effect(fatigue,1,allEnemies)
            )`,
        type: 'defense',
        characterClass: 'bard',
    },
    songOfSilence: {
        name: 'Song of Silence',
        energy: 1,
        id: 'songOfSilence',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            effect(unguarded, 2);
            effect(debilitated,2);
            effect(fatigue,1);
            effect(targeted,1)
        `,
        type: 'utility',
        characterClass: 'bard',
    },
    rapidFireBolts: {
        name: 'Rapid Fire Bolts',
        energy: 1,
        id: 'rapidFireBolts',
        targetNum: -1,
        targetType: 'allEnemies',
        actions: `
            strengthy = 0.5 * strength;
            deal(strengthy);
        `,
        type: 'attack',
        characterClass: 'bard',
    },
    swissArmyWand: {
        name: 'Swiss Army Wand',
        energy: 1,
        id: 'swissArmyWand',
        targetNum: 1,
        targetType: 'self',
        actions: `
            defenseymagicy = 0.25 * defense + 0.5 * magic;
            magicy = 0.25 * magic;
            chain(
                draw(2),
                discard(1),
                addBlock(defenseymagicy),
                modifyStats("magic", magicy, "turn")
            )
        `,
        type: 'utility',
        characterClass: 'wizard',
    },
    warStomp: {
        name: 'War Stomp',
        energy: 1,
        id: 'warStomp',
        targetNum: -1,
        targetType: 'allEnemies',
        actions: `
            strengthy = 0.4 * strength;
            effect(tired,1);
            deal(strengthy);
            `,
        type: 'attack',
        characterClass: 'warhog',
    },
    magicalTrebuchet: {
        name: 'Magical Trebuchet',
        energy: 1,
        id: 'magicalTrebuchet',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            magicy= 1.25 * magic;
            ifStance("avoidant", dealFromStance("avoidant",magicy))
        `,
        type: 'attack',
        characterClass: 'wizard',
    },
    tubularCellWall: {
        name: 'Tubular Cell Wall',
        energy: 1,
        id: 'tubularCellWall',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            defensey = 0.75 * defense
            defenseymagicy = 0.5 * defense + 0.25 * magic
            chain(
                addBlock(defensey);
                addBlockToSelf(defenseymagicy);
                 ),
            `,
        type: 'attack',
        characterClass: 'mushroomFarmer',
    },
    cultivate: {
        name: 'Cultivate',
        energy: 0,
        id: 'cultivate',
        targetNum: 0,
        targetType: 'self',
        actions: `
            chain(
                draw(1);
                discard(1);
                addEnergy(1)
                ),
            `,
        type: 'utility',
        characterClass: 'mushroomFarmer',
    },
    sleepyTimeSpores: {
        name: 'Sleepy Time Spores',
        energy: 1,
        id: 'sleepyTimeSpores',
        targetNum: -1,
        targetType: 'allEnemies',
        actions: `
            addEffect(fatigue,1)
            `,
        type: 'utility',
        characterClass: 'mushroomFarmer',
    },
    valiantJab: {
        name: 'Valiant Jab',
        energy: 1,
        id: 'valiantJab',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            chain(
                deal(strength),
                addEffect(unguarded,1),
                ),
            `,
        type: 'attack',
        characterClass: 'penguinKnight',
    },
    featheredFortress: {
        name: 'Feathered Fortress',
        energy: 1,
        id: 'featheredFortress',
        targetNum: 1,
        targetType: 'self',
        actions: `
            chain(
                addBlock(defense),
                addEffect(strongBlock,2),
                ifStance("neutral",addEffect(resistant,1)),
                ),
            `,
        type: 'defense',
        characterClass: 'penguinKnight',
    },
    hedgedBet: {
        name: 'Hedged Bet',
        energy: 1,
        id: 'hedgedBet',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            strengthymagicy = 0.5 * strength + 0.5 * magic
            chain(
                deal(strengthymagicy),
                addBlockToSelf(defense),
                draw(1),
                discard(1),
                ),
            `,
        type: 'attack',
        characterClass: 'snacky',
    },
    compulsiveGambler: {
        name: 'Compulsive Gambler',
        energy: 0,
        id: 'compulsiveGambler',
        targetNum: 1,
        targetType: 'self',
        actions: `
            chain(
                draw(3),
                discard(2),
                ),
            `,
        type: 'utility',
        characterClass: 'snacky',
    },
    youGottaStealMoneyToMakeMoney: {
        name: 'You Gotta Steal Money to Make Money',
        energy: 1,
        id: 'youGottaStealMoneyToMakeMoney',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            chain(
                strengthymagicy = 0.15 * magic + 0.1 * strength
                handSizey = strengthymagicy * handSize
                deal(handSizey),
                draw(2),
                dwindle(),
                ),
            `,
        type: 'attack',
        characterClass: 'snacky',
    },
    jerryIsEternal: {
        name: 'Jerry Is Eternal',
        energy: 1,
        id: 'jerryIsEternal',
        targetNum: 1,
        targetType: 'self',
        actions: `
            chain(
                addBlock(magic),
                addEffect("resistant",1),
                addEffect("trance",2)
            )
        `,
        type: 'defense',
        characterClass: 'jerry',
    },
    itIsWeakToJerry: {
        name: 'It is Weak to Jerry',
        energy: 1,
        id: 'itIsWeakToJerry',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            chain(
                addEffect(debilitated,1),
                addEffect(unguarded,1),
                addEffect(tense,1),
                dwindle(),
                ),
            `,
        type: 'attack',
        characterClass: 'jerry',
    },
    slipperyLittleGuy: {
        name: 'Slippery Little Guy',
        energy: 0,
        id: 'slipperyLittleGuy',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            chain(
                deal(strength),
                setStance("neutral"),
                ),
            `,
        type: 'attack',
        characterClass: 'frogKnight',
    },
    smallButStoic: {
        name: 'Small But Stoic',
        energy: 1,
        id: 'smallButStoic',
        targetNum: 1,
        targetType: 'self',
        actions: `
            defensey = 0.5 * defense
            chain(
                removeDebuff(unguarded,fatigue,debilitated,vulnerable,tired),
                addBlock(defensey),
                draw(1),
                ),
            `,
        type: 'utility',
        characterClass: 'frogKnight',
    },
    beVerySmall: {
        name: 'Be Very Small',
        energy: 0,
        id: 'beVerySmall',
        targetNum: 1,
        targetType: 'self',
        actions: `
            setStance("avoidant"),
            `,
        type: 'utility',
        characterClass: 'gnomeHooligan',
    },
    bellyFlop: {
        name: 'Belly Flop',
        energy: 1,
        id: 'bellyFlop',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            defensey = 0.5 * defense
            chain(
                deal(defense),
                addBlock(defensey),
                ),
            `,
        type: 'attack',
        characterClass: 'warhog',
    },
    screechOfTheBean: {
        name: 'Screech of the B.E.A.N.',
        energy: 1,
        id: 'screechOfTheBean',
        targetNum: -1,
        targetType: 'allEnemies',
        actions: `
            strengthy = 0.5 * strength
            deal(strengthy),
            `,
        type: 'attack',
        characterClass: 'notoriousBean',
    },
    magicShield: {
        name: 'Magic Shield',
        energy: 1,
        id: 'magicShield',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            defenseymagicy = 0.5 * defense + 0.75 * magic;
            addBlock(defenseymagicy)
        `,
        type: 'defense',
        characterClass: 'wizard',
    },
    huntedByTheBean: {
        name: 'Hunted by the Bean',
        energy: 1,
        id: 'huntedByTheBean',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            chain(
                effect(vulnerable,2),
                effect(bleed,3),
                momentary(),
            )`,
        type: 'utility',
        characterClass: 'notoriousBean',
    },
    beanNeverMisses: {
        name: 'B.E.A.N. Never Misses',
        energy: 1,
        id: 'beanNeverMisses',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            strengthy = 1.25 * strength;
            dealPiercing(strengthy)
            `,
        type: 'attack',
        characterClass: 'notoriousBean',
    },
    hope: {
        name: 'Hope',
        energy: 0,
        id: 'hope',
        targetNum: -1,
        targetType: 'allFriends',
        actions: `
            chain(
                addBlock(1),
                draw(2),
                momentary(),
            )`,
        type: 'utility',
        characterClass: 'bard',
    },
    songOfClarity: {
        name: 'Song of Clarity',
        energy: 1,
        id: 'songOfClarity',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            magicky = 0.2 * magic;
            chain(
                removeAllDebuffs(),
                heal(magicky),
                effect(emboldened,1),
                effect(guarded,1),
                momentary(),
            )`,
        type: 'utility',
        characterClass: 'bard',
    },
    dummyBomb: {
        name: 'Dummy Bomb',
        energy: 9,
        id: 'dummyBomb',
        targetNum: -1,
        targetType: 'allEnemies',
        actions: `
            explain("If this card is discarded, deal ", strength, " to all enemies")
        `,
        //TODO: implement
        on: {
            discard: 'deal(strength)',
        },
        type: 'attack',
        characterClass: 'rogue',
    },
    twistTheKnife: {
        name: 'Twist The Knife',
        energy: 1,
        id: 'twistTheKnife',
        targetNum: 1,
        targetType: 'enemies',
        //TODO
        actions: `
            strengthy = 1.25 * strength;
            strengthx = 1.5 * strength;
            ifHealth("=<", targetHealth * 0.5, deal(strengthx), deal(strengthy))
        `,
        type: 'attack',
        characterClass: 'rogue',
    },
    retreatToTheShadows: {
        name: 'Retreat to the Shadows',
        energy: 0,
        id: 'retreatToTheShadows',
        targetNum: 1,
        targetType: 'self',
        actions: `
            setStance("avoidant")
        `,
        type: 'utility',
        characterClass: 'rogue',
    },
    crimeAlwaysPays: {
        name: 'Crime Always Pays',
        energy: 1,
        id: 'crimeAlwaysPays',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            strengthy = 0.2 * strength;
            chain(
                deal(strengthy * handSize),
                explain("(hand size * ", strengthy, ")")
            )
        `,
        type: 'attack',
        characterClass: 'rogue',
    },
    declarationOfPeace: {
        name: 'Declaration of Peace',
        energy: 2,
        id: 'declarationOfPeace',
        targetNum: -1,
        targetType: 'allEnemies',
        actions: `
            chain(
                effect("debilitated",1),
                addBlockToSelf(defense)
            )
        `,
        type: 'utility',
        characterClass: 'cleric',
    },
    prayerOfGoodFortune: {
        name: 'Prayer of Good Fortune',
        energy: 2,
        id: 'prayerOfGoodFortune',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            chain(
                addBlock(incomingDamageIntended),
                "(equal to damage intended for this Kaiju)"
            )
        `,
        type: 'defense',
        characterClass: 'cleric',
    },
    prayerOfGoodHealth: {
        name: 'Prayer of Good Health',
        energy: 0,
        id: 'prayerOfGoodHealth',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            magicy = 0.2 * magic;
            heal(magicy)
        `,
        // brittle(3)
        type: 'utility',
        characterClass: 'cleric',
    },
    fellTheMighty: {
        name: 'Fell the Mighty',
        energy: 1,
        id: 'fellTheMighty',
        targetNum: 1,
        targetType: 'enemies',
        // TODO: targetMaxHealth
        // healthy = targetMaxHealth * 0.33;
        actions: `
            healthy = 0;
            chain(
                deal(healthy),
                "(one third of target max health)",
                brittle(3)
            )
        `,
        type: 'attack',
        characterClass: 'rogue',
    },
    burnIncense: {
        name: 'Burn Incesne',
        energy: -1,
        id: 'burnIncense',
        targetNum: 1,
        targetType: 'self',
        on: {
            discard: 'addEnergy(1)',
        },
        actions: `"if this card is discarded, gain 1 energy"`,
        type: 'utility',
        characterClass: 'cleric',
    },
    retreat: {
        name: 'Retreat',
        energy: 1,
        id: 'retreat',
        targetNum: 1,
        targetType: 'self',
        actions: `
            chain(
                addBlock(defense),
                setStance("avoidant")
            )`,
        type: 'defense',
        characterClass: 'knight',
    },
    bigLunge: {
        name: 'Big Lunge',
        energy: 1,
        id: 'bigLunge',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            strengthy = 1.5 * strength;
            chain(
                deal(strengthy),
                setStance("aggressive", "self")
            )`,
        type: 'attack',
        characterClass: 'knight',
    },
    hammerThrow: {
        name: 'Hammer Throw',
        energy: 2,
        id: 'hammerThrow',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            effect("stun",1)
        `,
        type: 'utility',
        characterClass: 'knight',
    },
    killingBlow: {
        name: 'Killing Blow',
        energy: 2,
        id: 'killingBlow',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            strengthy = 2.2 * strength;
            ifKilled(
                deal(strengthy),
                addEnergy(1)
            )`,
        type: 'attack',
        characterClass: 'knight',
    },
    cleave: {
        name: 'Cleave',
        energy: 1,
        id: 'cleave',
        targetNum: -1,
        targetType: 'allEnemies',
        actions: `
            strengthy = 0.6 * strength;
            ifStance("aggressive", deal(strengthy))
            `,
        type: 'attack',
        characterClass: 'knight',
    },
    whirlingBladesOfDeath: {
        name: 'Whirling Blades of Death',
        energy: 1,
        id: 'whirlingBladesOfDeath',
        targetNum: 1,
        targetType: 'self',
        // TODO: REFLECT
        actions: `
            strengthy = 0.4 * strength;
            chain(
                addBlock(defense),
                effect("reflect", strengthy)
            )`,
        type: 'defense',
        characterClass: 'knight',
    },
}
