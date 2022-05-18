import type { CharacterName, CharacterStats } from 'shared'
export const statsMap: Record<CharacterName, CharacterStats> = {
    bloatDemon: {
        name: 'bloatDemon',
        displayName: 'Bloat Demon',
        isPc: true,
        class: 'knight',
        maxHealth: 160,
        damage: 27,

        constitution: 160,
        strength: 27,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Bubbling Fire', types: ['ROD3', 'SP'] },
            { name: 'Noxious Fumes', types: ['DOT1', 'SP'] },
            { name: 'Iridescent Inferno', types: ['ROD1'] },
            { name: 'Precision Breathe', types: ['BA'] },
        ],
        modifier: 3,
        level: 1,
    },
    bogSpirit: {
        name: 'bogSpirit',
        displayName: 'Bog Spirit',
        isPc: true,
        class: 'knight',
        maxHealth: 224,
        damage: 16,

        constitution: 224,
        strength: 16,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Raw Stench of Death', types: ['SL', 'DOT1'] },
            { name: 'Talon Swipe', types: ['SP'] },
            { name: 'Exhale', types: ['DOT2'] },
            { name: 'Gorge', types: ['BA'] },
        ],
        modifier: 3,
        level: 1,
    },
    bookle: {
        name: 'bookle',
        displayName: 'Bookle',
        isPc: true,
        class: 'knight',
        maxHealth: 60,
        damage: 10,

        constitution: 60,
        strength: 10,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Kick', types: ['BA'] },
            { name: 'Paper Cut', types: ['SL'] },
        ],
        modifier: 1,
        level: 1,
    },
    bumbit: {
        name: 'bumbit',
        displayName: 'Bumbit',
        isPc: true,
        class: 'knight',
        maxHealth: 58,
        damage: 18,

        constitution: 58,
        strength: 18,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Maniacal Scream', types: ['SP', 'ROD3'] },
            { name: 'Marked By Death', types: ['DOT2'] },
            { name: 'Targeted Tantrum', types: ['BA'] },
        ],
        modifier: 2,
        level: 1,
    },
    frogKnight: {
        name: 'frogKnight',
        displayName: 'Frog Knight',
        isPc: true,
        class: 'knight',
        maxHealth: 72,
        damage: 8,

        constitution: 72,
        strength: 8,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Dutiful Stab', types: ['BA'] },
            { name: 'Sword Slash', types: ['SL'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Parry', types: ['DBF2'] },
            { minLevel: 2, name: 'Shield', types: ['BLK'] },
        ],
        modifier: 1,
        level: 1,
    },
    frogWizard: {
        name: 'frogWizard',
        displayName: 'Frog Wizard',
        isPc: true,
        class: 'knight',
        maxHealth: 66,
        damage: 24,

        constitution: 66,
        strength: 24,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Magic Missile', types: ['ROD1'] },
            { name: 'Vanishing Act', types: ['ROD2'] },
            { name: 'Sparks, Sparks Everywhere!', types: ['SP'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Magical Barrier', types: ['BLK'] },
        ],
        modifier: 2,
        level: 1,
    },
    gnomeHooligan: {
        name: 'gnomeHooligan',
        displayName: 'Gnome Hooligan',
        isPc: true,
        class: 'knight',
        maxHealth: 43,
        damage: 14,

        constitution: 43,
        strength: 14,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Bombs Away!', types: ['ROD3'] },
            { name: 'Bang Snap Inferno', types: ['SL', 'ROD2'] },
        ],
        modifier: 1,
        level: 1,
    },
    goblinDragon: {
        name: 'goblinDragon',
        displayName: 'Goblin Dragon',
        isPc: true,
        class: 'knight',
        maxHealth: 120,
        damage: 13,

        constitution: 120,
        strength: 13,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Fire Breath', types: ['SL'] },
            { name: 'Chomp', types: ['BA'] },
            { name: 'Burn It Down', types: ['DOT2'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Wall of Fire', types: ['DBF2'] },
        ],
        modifier: 2,
        level: 1,
    },
    greenJester: {
        name: 'greenJester',
        displayName: 'Green Jester',
        isPc: true,
        class: 'knight',
        maxHealth: 120,
        damage: 34,

        constitution: 120,
        strength: 34,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Oh God Oh No Oh God', types: ['ROD3', 'SL'] },
            { name: 'There Is No Punchline', types: ['SP', 'DOT1'] },
            { name: 'Whisper Scream', types: ['ROD2'] },
        ],
        modifier: 3,
        level: 1,
    },
    jerry: {
        name: 'jerry',
        displayName: 'Jerry',
        isPc: true,
        class: 'knight',
        maxHealth: 86,
        damage: 19,

        constitution: 86,
        strength: 19,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Telepathic Secrets', types: ['BA'] },
            { name: 'Extended Eye Contact', types: ['ROD1', 'DOT2'] },
            { name: 'Jerry Knows The Names of All', types: ['SP'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'The Curse of Jerry', types: ['DBF2'] },
            { minLevel: 2, name: 'Mental Interrogation', types: ['DBF1'] },
        ],
        modifier: 2,
        level: 1,
    },
    lichLord: {
        name: 'lichLord',
        displayName: 'Lich Lord',
        isPc: true,
        class: 'knight',
        maxHealth: 250,
        damage: 27,

        constitution: 250,
        strength: 27,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Death Comes For All', types: ['DC4A'] },
            { name: 'Inhale Soul', types: ['INHSO'] },
            { name: 'Waiting Around To Die', types: ['DOT1', 'ROD2'] },
            { name: 'Magic Missile', types: ['ROD1'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Essence Drain', types: ['DBF2'] },
        ],
        modifier: 3,
        level: 1,
    },
    matchaGelatinCube: {
        name: 'matchaGelatinCube',
        displayName: 'Matcha Gelatin Cube',
        isPc: false,
        class: 'knight',
        maxHealth: 78,
        damage: 7,

        constitution: 78,
        strength: 7,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Itchy Ooze', types: ['DOT1'] },
            { name: 'Surprise Allergy', types: ['ROD2'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Engulf in Jello', types: ['DBF1'] },
        ],
        modifier: 1,
        level: 1,
    },
    mimic: {
        name: 'mimic',
        displayName: 'Mimic',
        isPc: false,
        class: 'knight',
        maxHealth: 130,
        damage: 12,

        constitution: 130,
        strength: 12,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Mimic', types: ['MIM'] },
            { name: 'Chomp', types: ['BA'] },
            { name: 'Infectious Bite', types: ['ROD1', 'DOT1'] },
        ],
        modifier: 2,
        level: 1,
    },
    mushroomFarmer: {
        name: 'mushroomFarmer',
        displayName: 'Mushroom Farmer',
        isPc: true,
        class: 'bard',
        maxHealth: 112,
        damage: 8,

        constitution: 112,
        strength: 8,
        magic: 9,
        dexterity: 6,

        moves: [
            { name: 'Whomp', types: ['ROD1'] },
            { name: 'Cloud of Spores', types: ['DOT1', 'ROD3'] },
            { name: 'Bash', types: ['BA'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Tighten Fibers', types: ['BLK'] },
        ],
        modifier: 2,
        level: 1,
    },
    notoriousBEAN: {
        name: 'notoriousBEAN',
        displayName: 'Notorious B.E.A.N',
        isPc: true,
        class: 'knight',
        maxHealth: 75,
        damage: 14,

        constitution: 75,
        strength: 14,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Rapid Fire Bolts', types: ['SL'] },
            { name: 'Hunted By The B.E.A.N', types: ['DOT2'] },
            { name: 'B.E.A.N Never Misses', types: ['ST'] },
        ],
        modifier: 2,
        level: 1,
    },
    orcWarrior: {
        name: 'orcWarrior',
        displayName: 'Orc Warrior',
        isPc: false,
        class: 'knight',
        maxHealth: 88,
        damage: 12,

        constitution: 88,
        strength: 12,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Meaty Charge', types: ['BA'] },
            { name: 'Bellow and Sing', types: ['ROD2', 'SP'] },
            { name: 'Slash', types: ['SL'] },
        ],
        learnableMoves: [{ minLevel: 2, name: 'Shield', types: ['BLK'] }],
        modifier: 2,
        level: 1,
    },
    penguinKnight: {
        name: 'penguinKnight',
        displayName: 'Penguin Knight',
        isPc: true,
        class: 'knight',
        damage: 9,
        maxHealth: 66,
        constitution: 66,
        strength: 9,
        magic: 5,
        dexterity: 5,
        moves: [
            { name: 'Valiant Jab', types: ['BA'] },
            { name: 'Sword Slash', types: ['SL'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Parry', types: ['DBF2'] },
            { minLevel: 2, name: 'Shield', types: ['BLK'] },
        ],
        modifier: 1,
        level: 1,
    },
    skeletonWarrior: {
        name: 'skeletonWarrior',
        displayName: 'Skeleton Warrior',
        isPc: false,
        class: 'wizard',
        maxHealth: 10,
        damage: 2,

        constitution: 10,
        strength: 2,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Sword Whack', types: ['BA'] },
            { name: 'Rusty Poke', types: ['DOT2'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Parry', types: ['DBF2'] },
            { minLevel: 2, name: 'Shield', types: ['BLK'] },
        ],
        modifier: 1,
        level: 1,
    },
    snacky: {
        name: 'snacky',
        displayName: 'Snacky',
        isPc: true,
        class: 'knight',
        maxHealth: 67,
        damage: 16,

        constitution: 67,
        strength: 16,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Hedged Bet', types: ['ROD1', 'SL'] },
            { name: 'Compulsive Gambler', types: ['ROD3'] },
            { name: 'All In', types: ['SP', 'ROD3'] },
        ],
        modifier: 2,
        level: 1,
    },
    theHatefly: {
        name: 'theHatefly',
        displayName: 'The Hatefly',
        isPc: true,
        class: 'knight',
        maxHealth: 300,
        damage: 22,

        constitution: 300,
        strength: 22,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Devour', types: ['ROD3'] },
            { name: 'Copious Bleeding', types: ['DOT2', 'ROD1'] },
            { name: 'Chomp', types: ['BA'] },
            { name: 'Cloud of Flies', types: ['SP'] },
        ],
        learnableMoves: [{ minLevel: 2, name: 'Mutilate', types: ['DBF2'] }],
        modifier: 3,
        level: 1,
    },
    trioOfFools: {
        name: 'trioOfFools',
        displayName: 'Trio of Fools',
        isPc: true,
        class: 'knight',
        maxHealth: 110,
        damage: 15,

        constitution: 110,
        strength: 15,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Horrifying Maim', types: ['DOT2'] },
            { name: 'Endless Riddle', types: ['SL'] },
            { name: 'Three Fools Are Better Than One', types: ['SP'] },
        ],
        learnableMoves: [{ minLevel: 2, name: 'Cripple', types: ['DBF2'] }],
        modifier: 2,
        level: 1,
    },
    warhog: {
        name: 'warhog',
        displayName: 'Warhog',
        isPc: true,
        class: 'knight',
        maxHealth: 84,
        damage: 6,

        constitution: 84,
        strength: 6,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'Belly Flop', types: ['ROD2'] },
            { name: 'Roll Around', types: ['SL'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Very Thick Tummy', types: ['BLK'] },
        ],
        modifier: 1,
        level: 1,
    },
    wimpyGuard: {
        name: 'wimpyGuard',
        displayName: 'Wimpy Guard',
        isPc: true,
        class: 'knight',
        maxHealth: 170,
        damage: 24,

        constitution: 170,
        strength: 24,
        magic: 5,
        dexterity: 5,

        moves: [
            { name: 'A Friend You Can Count On', types: ['ST'] },
            { name: 'Valiant Whomp', types: ['ROD1', 'SL'] },
            { name: 'Whirling Baton', types: ['SP'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Protective Little Guy', types: ['BLK'] },
        ],
        modifier: 3,
        level: 1,
    },
}

// export const npcNames = Object.values(statsMap).filter(x => !x.isPc).map(x => x.name)
