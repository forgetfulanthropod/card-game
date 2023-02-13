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
    shieldOfHolyLight: {
        name: 'Shield of Holy Light',
        energy: 1,
        id: 'shieldOfHolyLight',
        targetNum: 1,
        targetType: 'friends',
        actions: `magicaldefensey = magic * 0.5 + defense; addBlock(magicaldefensey)`,
        type: 'defense',
        characterClass: 'cleric',
    },
    // TODO: if target is boss
    sweepTheLeg: {
        name: 'Sweep The Leg',
        energy: 1,
        id: 'sweepTheLeg',
        targetNum: 1,
        targetType: 'enemies',
        actions:
            'strength1 = strength * 0.5; chain(deal(strength1), effect("debilitated",1))',
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
            effect("stunned", 1, "enemies"),
            effect("debilitated", 1, "allEnemies"),
            effect("vulnerable", 1, "allEnemies"),
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
        actions: 'chain(orb("lightning", 3), momentary())',
        type: 'enchantment',
        characterClass: 'wizard',
    },
    orbOfProtection: {
        name: 'Orb of Protection',
        energy: 1,
        id: 'orbOfProtection',
        targetNum: 1,
        targetType: 'self',
        actions: 'chain(orb("protection", 3), momentary())',
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
        actions: 'chain(orb("frost", 3), momentary())',
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
    blockBard: {
        ...blockBase,
        id: 'blockBard',
        characterClass: 'bard',
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
        actions: `
            strengthy = 0.7 * strength;
            defensey = defense * 0.25;
            chain(
                deal(strengthy),
                addBlock(defensey, "self"),
                effect("guarded", 1, "self")
            )
        `,
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
            'ifStance("avoidant", queue(1, strengthy = strength * 2; dealFromStance("avoidant", strengthy)))',
        type: 'attack',
        characterClass: 'rogue',
    },
    stab: {
        name: 'Stab',
        energy: 1,
        id: 'stab',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            strengthy = strength + 1;
            chain(deal(strengthy), effect("bleed", 2))
        `,
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
        actions: `
            strengthmagic1 = (strength * 0.25) + (magic * 0.25);
            chain(deal(strengthmagic1), effect("poisoned", 5))
        `,
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
            'strength1 = strength * 2; chain(deal(strength1), effect("vulnerable", 2))',
        type: 'attack',
        characterClass: 'knight',
    },
    testudoFormation: {
        name: 'Testudo Formation',
        energy: 1,
        id: 'testudoFormation',
        targetNum: -1,
        targetType: 'allFriends',
        actions: `
            defense1 = 0.75 * defense;
            ifStance(
                "avoidant",
                chain(
                    addBlock(defense1),
                    effect("strongblock", 2)
                )
            )`,
        type: 'defense',
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
        actions: `chain(
            effect("courageous", 1, "allFriends"),
            effect("strongblock", 2, "allFriends")
        )`,
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
        actions: 'chain(orb("holyLight", 3), momentary())',
        type: 'enchantment',
        characterClass: 'cleric',
    },
    mantraOfPatience: {
        name: 'Mantra of Patience',
        energy: 1,
        id: 'mantraOfPatience',
        targetNum: 1,
        targetType: 'self',
        actions: 'chain(draw(2), queue(1, addEnergy(2)), momentary())',
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
        energy: 0,
        id: 'ancientVerse',
        targetNum: -1,
        targetType: 'allFriends',
        actions: `
            chain(
                modifyStats("strength|magic", "2|2", "room", "allFriends"),
                draw(1),
                dwindle()
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
            strengthy1 = strength * .5;
            magicy1 = magic * .5;
            strengthy2 = strength * .35;
            magicy2 = magic * .35;
            chain(
                ifStanceElse(
                    "aggressive",
                    modifyStats(
                        "strength|magic",
                        "" + strengthy1 + "|" + magicy1,
                        "turn",
                        "friends"
                    ),
                    modifyStats(
                        "strength|magic",
                        "" + strengthy2 + "|" + magicy2,
                        "turn",
                        "friends"
                    )
                ),
                draw(1),
                momentary()
            )
        `,
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
            strengthmagicdefense1 = (0.5 * strength) + (0.5 * magic) + (0.25 * defense);
            magic1 = 0.4 * magic;
            chain(
                addBlock(strengthmagicdefense1),
                heal(magic1),
                brittle(4)
            )`,
        type: 'defense',
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
                modifyStats("strength", strengthy1, "turn"),
                addBlock(strengthy2),
                momentary()
            )`,
        type: 'utility',
        characterClass: 'bard',
    },
    songOfWizardry: {
        name: 'Song of Wizardry',
        energy: 1,
        id: 'songOfWizardry',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            magicy1 = magic;
            magicy2 = 0.75 * magic;
            chain(
                modifyStats("magic", magicy1, "turn"),
                addBlock(magicy2),
                momentary()
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
                effect("stun",1),
                effect("vulnerable",2),
                discardRandom(2),
                momentary()
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
            defenseymagicy = 0.5 * defense + 0.5 * magic;
            chain(
                addBlock(defenseymagicy),
                effect("guarded",2),
                effect("fatigued",1,"allEnemies"),
                momentary()
            )
        `,
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
            chain(
                effect("unguarded", 2),
                effect("debilitated",2),
                effect("fatigued",1),
                effect("targeted",1),
                momentary()
            )
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
            deal(strengthy)
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
            chain(
                deal(strengthy),
                effect("tired",1)
            )
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
            defensey = 0.75 * defense;
            defenseymagicy = 0.5 * defense + 0.25 * magic;
            chain(
                addBlock(defensey),
                addBlock(defenseymagicy, "self")
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
                draw(1),
                discard(1),
                addEnergy(1)
            )
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
                addBlock(defense, "self"),
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
            strengthymagicy = 0.15 * magic + 0.1 * strength;
            handSizey = strengthymagicy * handSize;
            chain(
                deal(handSizey),
                draw(2),
                dwindle()
            )
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
                setStance("neutral", "self"),
                dwindle(1)
            )
            `,
        type: 'attack',
        characterClass: 'frogKnight',
    },
    // TODO: check if broken
    // with defense being calculated before removing debuffs
    smallButStoic: {
        name: 'Small But Stoic',
        energy: 0,
        id: 'smallButStoic',
        targetNum: 1,
        targetType: 'self',
        actions: `
            defensey = 0.5 * defense;
            chain(
                removeAllDebuffs(),
                addBlock(defensey),
                draw(1)
            )
            `,
        type: 'utility',
        characterClass: 'frogKnight',
    },
    // beVerySmall: {
    //     name: 'Be Very Small',
    //     energy: 0,
    //     id: 'beVerySmall',
    //     targetNum: 1,
    //     targetType: 'self',
    //     actions: `
    //         setStance("avoidant")
    //     `,
    //     type: 'utility',
    //     characterClass: 'gnomeHooligan',
    // },
    bellyFlop: {
        name: 'Belly Flop',
        energy: 1,
        id: 'bellyFlop',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            defense1 = 0.5 * defense;
            chain(
                deal(defense),
                addBlock(defense1, "self")
            )
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
            strengthy = 0.5 * strength;
            chain(
                deal(strengthy),
                discardRandom(1)
            )
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
                effect("vulnerable",2),
                effect("bleed",4),
                momentary()
            )
        `,
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
            deal(strengthy, "piercing")
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
            defensey = 0.1 * defense;
            chain(
                addBlock(defensey),
                draw(2),
                momentary()
            )
        `,
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
                effect("brave",1),
                effect("guarded",1),
                momentary()
            )
        `,
        type: 'utility',
        characterClass: 'bard',
    },
    dummyBomb: {
        name: 'Dummy Bomb',
        energy: -1,
        id: 'dummyBomb',
        targetNum: -1,
        targetType: 'allEnemies',
        actions: `
            explain("If this card is discarded before the end of your turn, deal ", strength, " to all enemies. <b>Momentary</b>")
        `,
        on: {
            discard: 'deal(strength); momentary()',
        },
        type: 'attack',
        characterClass: 'rogue',
    },

    // Deal 125% to target enemy.  If that enemy has 50% or less than their starting health, deal 200% instead.  Give that enemy Bleed (1)."
    twistTheKnife: {
        name: 'Twist The Knife',
        energy: 1,
        id: 'twistTheKnife',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            strengthx = 1.25 * strength;
            strengthy = 2 * strength;
            chain(
                ifHealthUnder(50, deal(strengthy), deal(strengthx)),
                effect("bleed", 1)
            )
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
            chain(
                setStance("avoidant"),
                momentary()
            )
        `,
        type: 'utility',
        characterClass: 'rogue',
    },
    // TODO fix explanation damage number
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
                addBlock(defense, "self")
            )
        `,
        type: 'utility',
        characterClass: 'cleric',
    },
    // TODO
    // prayerOfGoodFortune: {
    //     name: 'Prayer of Good Fortune',
    //     energy: 2,
    //     id: 'prayerOfGoodFortune',
    //     targetNum: 1,
    //     targetType: 'friends',
    //     actions: `
    //         addBlock("incomingDamageIntended");
    //         chain(
    //             "Generate block equal to the amount of damage target<br/>Kaiju would take this turn",
    //             brittle(1)
    //         )
    //     `,
    //     type: 'defense',
    //     characterClass: 'cleric',
    // },
    prayerOfGoodHealth: {
        name: 'Prayer of Good Health',
        energy: 0,
        id: 'prayerOfGoodHealth',
        targetNum: 1,
        targetType: 'friends',
        actions: `
            magic1 = 0.2 * magic;
            chain(
                heal(magic1),
                brittle(3)
            )
        `,
        type: 'utility',
        characterClass: 'cleric',
    },
    fellTheMighty: {
        name: 'Fell the Mighty',
        energy: 1,
        id: 'fellTheMighty',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            constitution1 = targetConstitution / 2;
            chain(
                deal(constitution1),
                brittle(1)
            );
            "Deal 50% of the target's max HP.\n<b>Brittle (1)</b>"`,
        type: 'attack',
        characterClass: 'cleric',
    },
    burnIncense: {
        name: 'Burn Incense',
        energy: -1,
        id: 'burnIncense',
        targetNum: 1,
        targetType: 'self',
        on: {
            discard: 'addEnergy(1)',
        },
        actions: `"This card cannot be played. If this card is discarded before the end of your turn, gain 1 energy"`,
        type: 'utility',
        characterClass: 'cleric',
    },
    retreat: {
        name: 'Retreat',
        energy: 1,
        id: 'retreat',
        targetNum: -1,
        targetType: 'allFriends',
        actions: `
            defense1 = 0.5 * defense;
            chain(
                addBlock(defense1),
                setStance("avoidant", "self"),
                discard(1)
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
            strengthy = 1.6 * strength;
            chain(
                deal(strengthy),
                effect("fatigued", 2),
                discard(1)
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
            chain(
                effect("stunned",1),
                brittle(2)
            )`,
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
            chain(
                ifStance("aggressive", deal(strengthy)),
                dwindle(1)
            )
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
        actions: `
            strengthy = 0.4 * strength;
            chain(
                addBlock(defense),
                effect("reflect", strengthy)
            )`,
        type: 'defense',
        characterClass: 'knight',
    },
    gargantuanGnomeBomb: {
        name: 'Gargantuan Gnome Bomb',
        energy: 0,
        id: 'gargantuanGnomeBomb',
        targetNum: 1,
        targetType: 'enemies',
        actions: `
            strengthymagicy = 0.65 * magic + 0.65 * strength;
            chain(
                deal(strengthymagicy),
                brittle(2)
            )
            `,
        type: 'attack',
        characterClass: 'gnomeHooligan',
    },
    tinyKleptomaniac: {
        name: 'Tiny Kleptomaniac',
        energy: 0,
        id: 'tinyKleptomaniac',
        targetNum: -1,
        targetType: 'friends',
        actions: `
            chain(
                draw(3),
                discard(2),
                momentary()
            )
        `,
        type: 'utility',
        characterClass: 'gnomeHooligan',
    },
    barterWithTheUnderworld: {
        name: 'Barter With The Underworld',
        energy: 1,
        id: 'barterWithTheUnderworld',
        targetNum: -1,
        targetType: 'allEnemies',
        actions: `
            magicy = magic * .15;
            chain(
                deal(magicy * discardPileSize),
                explain(magicy, "* discard pile size")
            )
        `,
        type: 'attack',
        characterClass: 'wizard',
    },
}
