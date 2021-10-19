// TODO: better name for this file and export?

// import { Immutable } from '@/config/immutable'
// import { deepFreeze } from '@/util'
import type { CharacterName, CharacterStats } from '@shared/index'
export const statsMap: Record<CharacterName, CharacterStats> = {
    bloatDemon: {
        name: 'bloatDemon',
        displayName: 'Bloat Demon',
        isPc: true,
        points: 40,
        maxHealth: 160,
        damage: 27,
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
        points: 40,
        maxHealth: 224,
        damage: 16,
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
        points: 15,
        maxHealth: 60,
        damage: 10,
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
        points: 20,
        maxHealth: 58,
        damage: 18,
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
        points: 15,
        maxHealth: 72,
        damage: 8,
        moves: [
            { name: 'Dutiful Stab', types: ['BA'] },
            { name: 'Sword Slash', types: ['SL'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Parry', types: ['DBF2'] },
            { minLevel: 2, name: 'Shield', types: ['BLK'] }
        ],
        modifier: 1,
        level: 1,
    },
    frogWizard: {
        name: 'frogWizard',
        displayName: 'Frog Wizard',
        isPc: true,
        points: 25,
        maxHealth: 66,
        damage: 24,
        moves: [
            { name: 'Magic Missile', types: ['ROD1'] },
            { name: 'Vanishing Act', types: ['ROD2'] },
            { name: 'Sparks, Sparks Everywhere!', types: ['SP'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Magical Barrier', types: ['BLK'] }
        ],
        modifier: 2,
        level: 1,
    },
    gnomeHooligan: {
        name: 'gnomeHooligan',
        displayName: 'Gnome Hooligan',
        isPc: true,
        points: 15,
        maxHealth: 43,
        damage: 14,
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
        points: 25,
        maxHealth: 120,
        damage: 13,
        moves: [
            { name: 'Fire Breath', types: ['SL'] },
            { name: 'Chomp', types: ['BA'] },
            { name: 'Burn It Down', types: ['DOT2'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Wall of Fire', types: ['DBF2'] }
        ],
        modifier: 2,
        level: 1,
    },
    greenJester: {
        name: 'greenJester',
        displayName: 'Green Jester',
        isPc: true,
        points: 40,
        maxHealth: 120,
        damage: 34,
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
        points: 25,
        maxHealth: 86,
        damage: 19,
        moves: [
            { name: 'Telepathic Secrets', types: ['BA'] },
            { name: 'Extended Eye Contact', types: ['ROD1', 'DOT2'] },
            { name: 'Jerry Knows The Names of All', types: ['SP'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'The Curse of Jerry', types: ['DBF2'] },
            { minLevel: 2, name: 'Mental Interrogation', types: ['DBF1'] }
        ],
        modifier: 2,
        level: 1,
    },
    lichLord: {
        name: 'lichLord',
        displayName: 'Lich Lord',
        isPc: true,
        points: 50,
        maxHealth: 250,
        damage: 27,
        moves: [
            { name: 'Death Comes For All', types: ['DC4A'] },
            { name: 'Inhale Soul', types: ['INHSO'] },
            { name: 'Waiting Around To Die', types: ['DOT1', 'ROD2'] },
            { name: 'Magic Missile', types: ['ROD1'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Essence Drain', types: ['DBF2'] }
        ],
        modifier: 3,
        level: 1,
    },
    matchaGelatinCube: {
        name: 'matchaGelatinCube',
        displayName: 'Matcha Gelatin Cube',
        isPc: false,
        points: 15,
        maxHealth: 78,
        damage: 7,
        moves: [
            { name: 'Itchy Ooze', types: ['DOT1'] },
            { name: 'Surprise Allergy', types: ['ROD2'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Engulf in Jello', types: ['DBF1'] }
        ],
        modifier: 1,
        level: 1,
    },
    mimic: {
        name: 'mimic',
        displayName: 'Mimic',
        isPc: false,
        points: 25,
        maxHealth: 130,
        damage: 12,
        moves: [
            { name: 'Mimic', types: ['MIM'] }, // TODO: copies the last ability to have targeted this character but uses the mimic's attack damage instead
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
        points: 20,
        maxHealth: 112,
        damage: 8,
        moves: [
            { name: 'Whomp', types: ['ROD1'] },
            { name: 'Cloud of Spores', types: ['DOT1', 'ROD3'] },
            { name: 'Bash', types: ['BA'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Tighten Fibers', types: ['BLK'] }
        ],
        modifier: 2,
        level: 1,
    },
    notoriousBEAN: {
        name: 'notoriousBEAN',
        displayName: 'Notorious B.E.A.N',
        isPc: true,
        points: 20,
        maxHealth: 75,
        damage: 14,
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
        points: 20,
        maxHealth: 88,
        damage: 12,
        moves: [
            { name: 'Meaty Charge', types: ['BA'] },
            { name: 'Bellow and Sing', types: ['ROD2', 'SP'] },
            { name: 'Slash', types: ['SL'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Shield', types: ['BLK'] }
        ],
        modifier: 2,
        level: 1,
    },
    penguinKnight: {
        name: 'penguinKnight',
        displayName: 'Penguin Knight',
        isPc: true,
        points: 15,
        maxHealth: 66,
        damage: 9,
        moves: [
            { name: 'Valiant Jab', types: ['BA'] },
            { name: 'Sword Slash', types: ['SL'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Parry', types: ['DBF2'] },
            { minLevel: 2, name: 'Shield', types: ['BLK'] }
        ],
        modifier: 1,
        level: 1,
    },
    skeletonWarrior: {
        name: 'skeletonWarrior',
        displayName: 'Skeleton Warrior',
        isPc: false,
        points: 15,
        maxHealth: 54,
        damage: 2,
        moves: [
            { name: 'Sword Whack', types: ['BA'] },
            { name: 'Rusty Poke', types: ['DOT2'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Parry', types: ['DBF2'] },
            { minLevel: 2, name: 'Shield', types: ['BLK'] }
        ],
        modifier: 1,
        level: 1,
    },
    snacky: {
        name: 'snacky',
        displayName: 'Snacky',
        isPc: true,
        points: 20,
        maxHealth: 67,
        damage: 16,
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
        points: 50,
        maxHealth: 300,
        damage: 22,
        moves: [
            { name: 'Devour', types: ['ROD3'] },
            { name: 'Copious Bleeding', types: ['DOT2', 'ROD1'] },
            { name: 'Chomp', types: ['BA'] },
            { name: 'Cloud of Flies', types: ['SP'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Mutilate', types: ['DBF2'] }
        ],
        modifier: 3,
        level: 1,
    },
    trioOfFools: {
        name: 'trioOfFools',
        displayName: 'Trio of Fools',
        isPc: true,
        points: 25,
        maxHealth: 110,
        damage: 15,
        moves: [
            { name: 'Horrifying Maim', types: ['DOT2'] },
            { name: 'Endless Riddle', types: ['SL'] },
            { name: 'Three Fools Are Better Than One', types: ['SP'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Cripple', types: ['DBF2'] }
        ],
        modifier: 2,
        level: 1,
    },
    warhog: {
        name: 'warhog',
        displayName: 'Warhog',
        isPc: true,
        points: 15,
        maxHealth: 84,
        damage: 6,
        moves: [
            { name: 'Belly Flop', types: ['ROD2'] },
            { name: 'Roll Around', types: ['SL'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Very Thick Tummy', types: ['BLK'] }
        ],
        modifier: 1,
        level: 1,
    },
    wimpyGuard: {
        name: 'wimpyGuard',
        displayName: 'Wimpy Guard',
        isPc: true,
        points: 40,
        maxHealth: 170,
        damage: 24,
        moves: [
            { name: 'A Friend You Can Count On', types: ['ST'] },
            { name: 'Valiant Whomp', types: ['ROD1', 'SL'] },
            { name: 'Whirling Baton', types: ['SP'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Protective Little Guy', types: ['BLK'] }
        ],
        modifier: 3,
        level: 1,
    },
}

export const npcNames = Object.values(statsMap).filter(x => !x.isPc).map(x => x.name)
