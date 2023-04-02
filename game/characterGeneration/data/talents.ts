import { Rarity } from './rarities'
import { Species, CharacterClass } from './stats'

export const numTalents: Record<Rarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 3,
}

export const talentRarities: Record<
  Rarity,
  Record<Species | CharacterClass | 'generic', Array<string>>
> = {
  common: {
    bard: [],
    cleric: [],
    frog: [],
    generic: [
      'aboveAverageMetabolism',
      'worksOutOccasionally',
      'magicallyInclined',
      'tougherThanMost',
    ],
    knight: [],
    penguin: [],
    rogue: [],
    warhog: [],
    wizard: [],
  },
  uncommon: {
    bard: ['quickWittedInsults', 'loungeSinger'],
    cleric: ['emergencyBaptismKit', 'bloodPact'],
    frog: ['stickyTongue', 'slipperyWhenWet', 'stickyhands'],
    generic: [
      'fisherman',
      'hypochondriac',
      'quickToPickAFight',
      'excellentCook',
      'bully',
      'selflessCompanion',
      'stealthy',
      'frontlineFighter',
      'levelHeaded',
      'healthyEater',
      'gymRat',
      'sorcerer',
      'thickSkinned',
    ],
    knight: ['barbarian', 'pillager', 'nobleGuardian'],
    penguin: ['anxietyRiddled', 'accidentProne', 'oathOftheMoment', 'peppy'],
    rogue: ['dirtyDealer', 'thrifty', 'scrappyAndVicious', 'oneWithTheShadows'],
    warhog: [
      'bigYawn',
      'shortTempered',
      'bigNapper',
      'veryVeryLarge',
      'reinforcedHooves',
    ],
    wizard: ['tormentedByWhispers', 'photographicMemory'],
  },
  rare: {
    bard: [
      'rolltoSeduce',
      'lordOfLullabies',
      'reallyGoodAtWritingSongsAboutWizards',
      'warriorPoet',
    ],
    cleric: [
      'selflessHealer',
      'immovableObject',
      'unholyPracticioner',
      'certifiedReikiSpecialist',
    ],
    frog: ['poisonousBlood', 'wiseCroaker'],
    generic: [
      'escapeArtist',
      'goodAtPlanning',
      'pressurePointSpecialist',
      'experiencedForager',
      'magnetForWeirdCircumstances',
      'marathonRunner',
      'bigGameHunter',
      'greatGuy',
      'ADHD',
    ],
    knight: [
      'royalGuard',
      'shieldProficiency',
      'intimidating',
      'attritionFighter',
    ],
    penguin: ['disarminglyCute', 'extraBlubbery', 'headEmpty'],
    rogue: [
      'masterLooter',
      'invigoratedbyBloodshed',
      'bagofContraband',
      'arterialArtisan',
    ],
    warhog: ['excellentStompDancer', 'thickBoned', 'ironSkinned'],
    wizard: ['fireMage', 'aspiringSeer', 'forgetfulGenius', 'theStarsAreRight'],
  },
  epic: {
    bard: [],
    cleric: ['pulseOfFaith'],
    frog: [],
    generic: ['bornSurvivor', 'secretVampire'],
    knight: ['veteranPitFighter', 'terrifying'],
    penguin: ['doingtheirBest'],
    rogue: [],
    warhog: ['apexOmnivore'],
    wizard: ['privyToAnAncientAndTerribleSecret', 'masterOracle'],
  },
}
