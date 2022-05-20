import type { Brandify } from './index'

export type CharacterName =
    | 'bloatDemon'
    | 'bogSpirit'
    | 'bookle'
    | 'bumbit'
    | 'frogKnight'
    | 'frogWizard'
    | 'gnomeHooligan'
    | 'goblinDragon'
    | 'greenJester'
    | 'jerry'
    | 'lichLord'
    | 'matchaGelatinCube'
    | 'mimic'
    | 'mushroomFarmer'
    | 'notoriousBEAN'
    | 'orcWarrior'
    | 'penguinKnight'
    | 'skeletonWarrior'
    | 'snacky'
    | 'theHatefly'
    | 'trioOfFools'
    | 'warhog'
    | 'wimpyGuard'

// TODO: reconcile duplicate definitions
export type SpecialDoorName =
    | 'bigScary'
    | 'candyBaby'
    | 'normal'
    | 'matcha'
    | 'skeleton'
    | 'rareItem'
    | 'bossDoor'
    | 'face'
    | 'tiny'
    | 'jumbo'
    | 'randomEvent'
    | 'campfire'

export type DungeonName =
    | 'Skelepit Dungeon'
    | 'Hooligan’s Bluff'
    | 'The Matcha Caves'
    | 'Fort Skeleton'
    | 'The Ninth Trash Hole of Hell'

export type PileId = 'draw' | 'hand' | 'discard' | 'removed'
export type ItemName = string & Brandify
export type ItemUid = string & Brandify
export type LocationName = string & Brandify
export type RecipeName = string & Brandify

export type MoveMetaName =
    | 'BA'
    | 'SL'
    | 'SP'
    | 'ROD1'
    | 'ROD2'
    | 'ROD3'
    | 'DOT1'
    | 'DOT2'
    | 'ST'
    | 'INHSO'
    | 'DC4A'
    | 'MIM'
    | 'DBF1'
    | 'DBF2'
    | 'BLK'

export type BlessingName =
    | 'ptbotflax'
    | 'strongPcs'
    | 'strongEnemies'
    | 'weakEnemies'
    | 'weakPcs'

export type StanceName = 'defensive' | 'neutral' | 'aggressive'
