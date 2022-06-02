import type { Executors, Explainers } from './util'

export type { Locals } from './util'
// @index(['./*.ts'], (f, _) => `import {explain as explain${pascalCase(f.name)}, execute as execute${pascalCase(f.name)}} from '${f.path}'`)
import {explain as explainAddBlock, execute as executeAddBlock} from './addBlock'
import {explain as explainAddEnergy, execute as executeAddEnergy} from './addEnergy'
import {explain as explainChain, execute as executeChain} from './chain'
import {explain as explainDeal, execute as executeDeal} from './deal'
import {explain as explainEffect, execute as executeEffect} from './effect'
import {explain as explainIfFirstPlay, execute as executeIfFirstPlay} from './ifFirstPlay'
import {explain as explainIfTargetDied, execute as executeIfTargetDied} from './ifTargetDied'
import {explain as explainKillIf, execute as executeKillIf} from './killIf'
import {explain as explainMomentary, execute as executeMomentary} from './momentary'
import {explain as explainOrb, execute as executeOrb} from './orb'
import {explain as explainQueue, execute as executeQueue} from './queue'
import {explain as explainText, execute as executeText} from './text'
// @endindex

export const explainers: Explainers = {
    // @index(['./*.ts'], (f, _) => `${f.name}: explain${_.pascalCase(f.name)},`)
    addBlock: explainAddBlock,
    addEnergy: explainAddEnergy,
    chain: explainChain,
    deal: explainDeal,
    effect: explainEffect,
    ifFirstPlay: explainIfFirstPlay,
    ifTargetDied: explainIfTargetDied,
    killIf: explainKillIf,
    momentary: explainMomentary,
    orb: explainOrb,
    queue: explainQueue,
    text: explainText,
    // @endindex
}

export const executors: Executors = {
    // @index(['./*.ts'], (f, _) => `${f.name}: execute${_.pascalCase(f.name)},`)
    addBlock: executeAddBlock,
    addEnergy: executeAddEnergy,
    chain: executeChain,
    deal: executeDeal,
    effect: executeEffect,
    ifFirstPlay: executeIfFirstPlay,
    ifTargetDied: executeIfTargetDied,
    killIf: executeKillIf,
    momentary: executeMomentary,
    orb: executeOrb,
    queue: executeQueue,
    text: executeText,
    // @endindex
}

// main remaining card verbs: doubleEnchantmentOrToken, choice
//  - ones with weird choice / target selection: arcanePower, prayerOfGoodFortune

// remaining verbs from enemies: mimicAttack, dot, ifDamageDealt, damageTaken, rest, matchaMeld, summon
