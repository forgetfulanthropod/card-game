import type { NonPlayerCharacterId, NpcCommandId } from 'shared'
type Level = string
export const npcStatsMapByLevel: Record<NonPlayerCharacterId, Record<Level, EnemyDefinition>> = {
    skeletonWarrior: {
        // 1: { level: '1', wisdom: 0, constitution: 18, strength: 4, defense: 7, moves: ['swordWack', null, null, 'block', null] },
        1: { level: '1', magic: 0, constitution: 19, strength: 10, defense: 7, moves: ['swordWack', 'rustyPokeLow', 'jab', 'strike', 'jab'] },
        2: { level: '2', magic: 0, constitution: 27, strength: 14, defense: 9, moves: ['swordWack', 'rustyPokeLow', 'swordWack', 'block', 'swordWack'] },
        3: { level: '3', magic: 0, constitution: 36, strength: 18, defense: 12, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', 'swordWack'] },
        4: { level: '4', magic: 0, constitution: 50, strength: 22, defense: 16, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', 'swordWack'] },
        5: { level: '5', magic: 0, constitution: 65, strength: 26, defense: 19, moves: ['swordWack', 'rustyPokeLow', 'slash', 'block', 'swordWack'] },
        6: { level: '6', magic: 0, constitution: 87, strength: 30, defense: 22, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(1,1)'] },
        7: { level: '7', magic: 0, constitution: 101, strength: 34, defense: 25, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(2,2)'] },
        8: { level: '8', magic: 0, constitution: 121, strength: 38, defense: 28, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(2,2)'] },
        9: { level: '9', magic: 0, constitution: 135, strength: 42, defense: 31, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(3,3)'] },
        10: { level: '10', magic: 0, constitution: 150, strength: 46, defense: 34, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(3,3)'] },
    },
    matchaGelatinCube: {
        // 1: { level: '1', wisdom: 0, constitution: 1, strength: 3, defense: 10, moves: ['strike', 'block', 'strike', 'block', 'strike'] },
        1: { level: '1', magic: 0, constitution: 22, strength: 8, defense: 10, moves: ['itchyOoze(2)', 'block', 'strike', 'block', 'strike'] },
        2: { level: '2', magic: 0, constitution: 36, strength: 14, defense: 14, moves: ['strike', 'surpriseAllergy(2,1)', 'block', 'strike', 'block'] },
        3: { level: '3', magic: 0, constitution: 55, strength: 20, defense: 17, moves: ['strike', 'surpriseAllergy(2,1)', 'itchyOoze(3)', 'block', 'surpriseAllergy(3,2)'] },
        4: { level: '4', magic: 0, constitution: 72, strength: 22, defense: 22, moves: ['strike', 'surpriseAllergy(3,2)', 'itchyOoze(4)', 'block', 'surpriseAllergy(3,2)'] },
        5: { level: '5', magic: 0, constitution: 80, strength: 32, defense: 26, moves: ['strike', 'surpriseAllergy(3,2)', 'itchyOozeSpecial', 'block', 'surpriseAllergy(3,2)'] },
        6: { level: '6', magic: 0, constitution: 105, strength: 38, defense: 31, moves: ['strike', 'surpriseAllergy(3,2)', 'itchyOoze(5)', 'block', 'engulf(50)'] },
        7: { level: '7', magic: 0, constitution: 130, strength: 44, defense: 36, moves: ['strike', 'surpriseAllergy(3,2)', 'itchyOoze(6)', 'block', 'engulf(50)'] },
        8: { level: '8', magic: 0, constitution: 160, strength: 50, defense: 41, moves: ['strike', 'surpriseAllergy(4,2)', 'itchyOoze(7)', 'block', 'engulf(75)'] },
        9: { level: '9', magic: 0, constitution: 175, strength: 56, defense: 48, moves: ['strike', 'surpriseAllergy(4,2)', 'itchyOoze(8)', 'block', 'engulf(75)'] },
        10: { level: '10', magic: 0, constitution: 200, strength: 62, defense: 56, moves: ['strike', 'surpriseAllergy(5,2)', 'itchyOoze(9)', 'block', 'engulf(75)'] },
        large: { level: 'large', magic: 0, constitution: '200-100', strength: 68, defense: 20, moves: ['matchaMash', 'matchaMadness', 'matchaMeld', 'surpriseAllergy(2,1)', 'surpriseAllergy(2,1)'] },
        medium: { level: 'medium', magic: 0, constitution: '99-30', strength: 74, defense: 10, moves: ['matchaMash', 'surpriseAllergy(2,1)', 'surpriseAllergy(2,1)', 'surpriseAllergy(2,1)', 'surpriseAllergy(2,1)'] },
        small: { level: 'small', magic: 0, constitution: '>29', strength: 80, defense: 5, moves: ['matchaMash', 'surpriseAllergy(2,1)', 'surpriseAllergy(2,1)', 'surpriseAllergy(2,1)', 'surpriseAllergy(2,1)'] },
    },
    gnomeHooligan: {
        1: { level: '1', magic: 0, constitution: 10, strength: 10, defense: 6, moves: ['gnomeBomb(1)', 'bellowAndSing(1,1)', 'gnomeBomb(1)', 'block', 'gnomeBomb(1)'] },
        2: { level: '2', magic: 0, constitution: 12, strength: 12, defense: 8, moves: ['gnomeBomb(1)', 'bellowAndSing(1,1)', 'gnomeBomb(2)', 'block', 'gnomeBomb(1)'] },
        3: { level: '3', magic: 0, constitution: 14, strength: 14, defense: 10, moves: ['gnomeBomb(1)', 'slash', 'gnomeBomb(1)', 'block', 'gnomeBomb(1)'] },
        4: { level: '4', magic: 0, constitution: 16, strength: 16, defense: 12, moves: ['gnomeBomb(1)', 'slash', 'bellowAndSing(1,1)', 'block', 'gnomeBomb(1)'] },
        5: { level: '5', magic: 0, constitution: 18, strength: 18, defense: 14, moves: ['gnomeBomb(1)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        6: { level: '6', magic: 0, constitution: 20, strength: 20, defense: 16, moves: ['gnomeBomb(1)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        7: { level: '7', magic: 0, constitution: 22, strength: 22, defense: 19, moves: ['gnomeBomb(1)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,2)'] },
        8: { level: '8', magic: 0, constitution: 24, strength: 24, defense: 22, moves: ['gnomeBomb(1)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
        9: { level: '9', magic: 0, constitution: 26, strength: 26, defense: 25, moves: ['gnomeBomb(1)', 'slash', 'bellowAndSing(2,1)', 'block', 'screamAndCharge(125,2)'] },
        10: { level: '10', magic: 0, constitution: 28, strength: 28, defense: 28, moves: ['gnomeBomb(1)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
    },
    orcWarrior: {
        1: { level: '1', magic: 0, constitution: 15, strength: 14, defense: 6, moves: ['meatyCharge(1)', 'meatyCharge(1)', 'meatyCharge(1)', 'block', 'meatyCharge(1)'] },
        2: { level: '2', magic: 0, constitution: 33, strength: 20, defense: 8, moves: ['meatyCharge(1)', 'meatyCharge(1)', 'meatyCharge(1)', 'block', 'meatyCharge(1)'] },
        3: { level: '3', magic: 0, constitution: 50, strength: 26, defense: 10, moves: ['meatyCharge(1)', 'slash', 'meatyCharge(1)', 'block', 'meatyCharge(1)'] },
        4: { level: '4', magic: 0, constitution: 75, strength: 32, defense: 12, moves: ['meatyCharge(1)', 'slash', 'bellowAndSing(1,1)', 'block', 'meatyCharge(1)'] },
        5: { level: '5', magic: 0, constitution: 88, strength: 38, defense: 14, moves: ['meatyCharge(1)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        6: { level: '6', magic: 0, constitution: 103, strength: 44, defense: 16, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,1)'] },
        7: { level: '7', magic: 0, constitution: 118, strength: 50, defense: 19, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(100,2)'] },
        8: { level: '8', magic: 0, constitution: 133, strength: 56, defense: 22, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
        9: { level: '9', magic: 0, constitution: 148, strength: 62, defense: 25, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,1)', 'block', 'screamAndCharge(125,2)'] },
        10: { level: '10', magic: 0, constitution: 163, strength: 68, defense: 28, moves: ['meatyCharge(2)', 'slash', 'bellowAndSing(2,2)', 'block', 'screamAndCharge(125,2)'] },
    },
    warhog: {
        1: { level: '1', magic: 0, constitution: 135, strength: 42, defense: 31, moves: ['swordWack', 'rustyPokeHigh', 'slash', 'block', 'startlingSpook(3,3)'] },

        // 1: { level: '1', wisdom: 0, constitution: 190, strength: 30, defense: 30, moves: ['jurgenBellyFlop', 'jurgenRollAround', 'jurgenStampSnort', 'block', 'jurgenSitUpon'] },
    },
    bosshogJurgen: {
        default: { level: 'default', magic: 0, constitution: 190, strength: 30, defense: 30, moves: ['jurgenBellyFlop', 'jurgenRollAround', 'jurgenStampSnort', 'block', 'jurgenSitUpon'] },
    },
    mimic: {
        1: { level: '1', magic: 0, constitution: 39, strength: 3, defense: 8, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        2: { level: '2', magic: 0, constitution: 66, strength: 4, defense: 12, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        3: { level: '3', magic: 0, constitution: 103, strength: 6, defense: 16, moves: ['mimicAttack', 'chomp', 'infectiousBite(2)', 'block', null] },
        4: { level: '4', magic: 0, constitution: 129, strength: 8, defense: 20, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        5: { level: '5', magic: 0, constitution: 155, strength: 12, defense: 24, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        6: { level: '6', magic: 0, constitution: 172, strength: 14, defense: 28, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        7: { level: '7', magic: 0, constitution: 205, strength: 16, defense: 32, moves: ['mimicAttack', 'chomp', 'infectiousBite(3)', 'block', null] },
        8: { level: '8', magic: 0, constitution: 222, strength: 18, defense: 35, moves: ['mimicAttack', 'chomp', 'infectiousBite(4)', 'block', null] },
        9: { level: '9', magic: 0, constitution: 245, strength: 20, defense: 38, moves: ['mimicAttack', 'chomp', 'infectiousBite(4)', 'block', null] },
        10: { level: '10', magic: 0, constitution: 264, strength: 22, defense: 42, moves: ['mimicAttack', 'chomp', 'infectiousBite(5)', 'block', null] },
    },
    toadmaw: {
        default: { level: 'default', magic: 0, constitution: 132, strength: 25, defense: 9, moves: ['hansBuffBlock', 'hansMagicMissile', 'hansGuards', 'hansCurse', null] },
    },
    cultist: {
        default: { level: 'default', magic: 0, constitution: 18, strength: 4, defense: 0, moves: ['attack4', null, null, null, null] },
    },
    halfdan: {
        default: { level: 'default', magic: 0, constitution: 250, strength: 25, defense: 20, moves: ['rest', 'evisceratingSweep', 'passiveBlockCmd', 'ancientStrike', null] },
    },
    gnomeBandit: {
        1: { level: '1', strength: 5, magic: 0, defense: 2, constitution: 11, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
        2: { level: '2', strength: 10, magic: 0, defense: 4, constitution: 22, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
        3: { level: '3', strength: 15, magic: 0, defense: 6, constitution: 33, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
        4: { level: '4', strength: 20, magic: 0, defense: 8, constitution: 44, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
        5: { level: '5', strength: 25, magic: 0, defense: 10, constitution: 55, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
        6: { level: '6', strength: 30, magic: 0, defense: 12, constitution: 66, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
        7: { level: '7', strength: 35, magic: 0, defense: 14, constitution: 77, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
        8: { level: '8', strength: 40, magic: 0, defense: 16, constitution: 88, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
        9: { level: '9', strength: 45, magic: 0, defense: 18, constitution: 99, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
        10: { level: '10', strength: 50, magic: 0, defense: 20, constitution: 110, moves: ['gnomeBomb', 'bucketOfBangSnaps', 'fireCracker', 'block'],},
    },
    gnomeProspector: {
        1: { level: 1, strength: 5, magic: 0, defense: 2, constitution: 13, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
        2: { level: 2, strength: 10, magic: 0, defense: 4, constitution: 26, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
        3: { level: 3, strength: 15, magic: 0, defense: 6, constitution: 39, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
        4: { level: 4, strength: 20, magic: 0, defense: 8, constitution: 52, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
        5: { level: 5, strength: 25, magic: 0, defense: 10, constitution: 65, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
        6: { level: 6, strength: 30, magic: 0, defense: 12, constitution: 78, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
        7: { level: 7, strength: 35, magic: 0, defense: 14, constitution: 91, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
        8: { level: 8, strength: 40, magic: 0, defense: 16, constitution: 104, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
        9: { level: 9, strength: 45, magic: 0, defense: 18, constitution: 117, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
        10: { level: 10, strength: 50, magic: 0, defense: 20, constitution: 130, moves: [/*'yodel', 'demoltionCharge',*/ 'gnomeBomb', 'block'],},
    },
    gnomeBigBomber: {
        1: { level: 1, strength: 5, magic: 0, defense: 4, constitution: 12, moves: ['block', /*'bigBomb', null, null, null*/],},
        2: { level: 2, strength: 10, magic: 0, defense: 8, constitution: 24, moves: ['block', /*'bigBomb', null, null, null*/],},
        3: { level: 3, strength: 15, magic: 0, defense: 12, constitution: 36, moves: ['block', /*'bigBomb', null, null, null*/],},
        4: { level: 4, strength: 20, magic: 0, defense: 16, constitution: 48, moves: ['block', /*'bigBomb', null, null, null*/],},
        5: { level: 5, strength: 25, magic: 0, defense: 20, constitution: 60, moves: ['block', /*'bigBomb', null, null, null*/],},
        6: { level: 6, strength: 30, magic: 0, defense: 24, constitution: 72, moves: ['block', /*'bigBomb', null, null, null*/],},
        7: { level: 7, strength: 35, magic: 0, defense: 28, constitution: 84, moves: ['block', /*'bigBomb', null, null, null*/],},
        8: { level: 8, strength: 40, magic: 0, defense: 32, constitution: 96, moves: ['block', /*'bigBomb', null, null, null*/],},
        9: { level: 9, strength: 45, magic: 0, defense: 36, constitution: 108, moves: ['block', /*'bigBomb', null, null, null*/],},
        10: { level: 10, strength: 50, magic: 0, defense: 40, constitution: 120, moves: ['block', /*'bigBomb', null, null, null*/],},
    },
    groghog: {
        1: { level: 1, strength: 4, magic: 0, defense: 7, constitution: 16, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
        2: { level: 2, strength: 8, magic: 0, defense: 14, constitution: 32, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
        3: { level: 3, strength: 12, magic: 0, defense: 21, constitution: 48, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
        4: { level: 4, strength: 16, magic: 0, defense: 28, constitution: 64, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
        5: { level: 5, strength: 20, magic: 0, defense: 35, constitution: 80, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
        6: { level: 6, strength: 24, magic: 0, defense: 42, constitution: 96, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
        7: { level: 7, strength: 28, magic: 0, defense: 49, constitution: 112, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
        8: { level: 8, strength: 32, magic: 0, defense: 56, constitution: 128, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
        9: { level: 9, strength: 36, magic: 0, defense: 63, constitution: 144, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
        10: { level: 10, strength: 40, magic: 0, defense: 70, constitution: 160, moves: [/*'hypnosis', 'psychicBolt',*/ 'strike', 'block', /*'spiritQuest'*/],},
    },
    warhogRaider: {
        1: { level: 1, strength: 4, magic: 0, defense: 8, constitution: 18, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
        2: { level: 2, strength: 8, magic: 0, defense: 16, constitution: 36, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
        3: { level: 3, strength: 12, magic: 0, defense: 24, constitution: 54, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
        4: { level: 4, strength: 16, magic: 0, defense: 32, constitution: 72, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
        5: { level: 5, strength: 20, magic: 0, defense: 40, constitution: 90, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
        6: { level: 6, strength: 24, magic: 0, defense: 48, constitution: 108, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
        7: { level: 7, strength: 28, magic: 0, defense: 56, constitution: 126, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
        8: { level: 8, strength: 32, magic: 0, defense: 64, constitution: 144, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
        9: { level: 9, strength: 36, magic: 0, defense: 72, constitution: 162, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
        10: { level: 10, strength: 40, magic: 0, defense: 80, constitution: 180, moves: [/*'snortinTime', 'tummySlam', 'bigBelly',*/ 'strike', /*'quickNap'*/],},
    },
    plaguehog: {
        1: { level: 1, strength: 4, magic: 0, defense: 9, constitution: 20, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
        2: { level: 2, strength: 8, magic: 0, defense: 18, constitution: 40, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
        3: { level: 3, strength: 12, magic: 0, defense: 27, constitution: 60, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
        4: { level: 4, strength: 16, magic: 0, defense: 36, constitution: 80, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
        5: { level: 5, strength: 20, magic: 0, defense: 45, constitution: 100, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
        6: { level: 6, strength: 24, magic: 0, defense: 54, constitution: 120, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
        7: { level: 7, strength: 28, magic: 0, defense: 63, constitution: 140, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
        8: { level: 8, strength: 32, magic: 0, defense: 72, constitution: 160, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
        9: { level: 9, strength: 36, magic: 0, defense: 81, constitution: 180, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
        10: { level: 10, strength: 40, magic: 0, defense: 90, constitution: 200, moves: [/*'violentSneeze', 'surpriseAllergy',*/ 'strike', /*'parasiticNibble',*/ 'block'],},
    },
} as const // prettier-ignore

export type BaseHealth = number | `${number}-${number}` | `>${number}`
export type EnemyDefinition = {
    // displayName: string
    // level: number | string | null
    // id: string
    constitution: BaseHealth
    strength: number
    defense: number
    magic: number
    level: number | string
    // TODO: rename to commands
    moves: readonly (NpcCommandId | null)[]
}
