import type { Executors, Explainers } from './util'
// @index(['./*.ts'], (f, _) => `import {explain as explain${pascalCase(f.name)}, execute as execute${pascalCase(f.name)}} from '${f.path}'`)
import {explain as explainAddBlock, execute as executeAddBlock} from './addBlock'
import {explain as explainAddBlockToSelf, execute as executeAddBlockToSelf} from './addBlockToSelf'
import {explain as explainAddEnergy, execute as executeAddEnergy} from './addEnergy'
import {explain as explainAddEnergyPerRound, execute as executeAddEnergyPerRound} from './addEnergyPerRound'
import {explain as explainBellyFlop, execute as executeBellyFlop} from './bellyFlop'
import {explain as explainChain, execute as executeChain} from './chain'
import {explain as explainChoice, execute as executeChoice} from './choice'
import {explain as explainDeal, execute as executeDeal} from './deal'
import {explain as explainDealFromStance, execute as executeDealFromStance} from './dealFromStance'
import {explain as explainDiscard, execute as executeDiscard} from './discard'
import {explain as explainDoubleEnchantmentOrToken, execute as executeDoubleEnchantmentOrToken} from './doubleEnchantmentOrToken'
import {explain as explainDraw, execute as executeDraw} from './draw'
import {explain as explainDwindle, execute as executeDwindle} from './dwindle'
import {explain as explainEffect, execute as executeEffect} from './effect'
import {explain as explainEffectAll, execute as executeEffectAll} from './effectAll'
import {explain as explainIfDamageDealt, execute as executeIfDamageDealt} from './ifDamageDealt'
import {explain as explainIfDamageDealtApplyEffect, execute as executeIfDamageDealtApplyEffect} from './ifDamageDealtApplyEffect'
import {explain as explainIfFirstPlay, execute as executeIfFirstPlay} from './ifFirstPlay'
import {explain as explainIfStance, execute as executeIfStance} from './ifStance'
import {explain as explainKillIf, execute as executeKillIf} from './killIf'
import {explain as explainMimicAttack, execute as executeMimicAttack} from './mimicAttack'
import {explain as explainModifyStats, execute as executeModifyStats} from './modifyStats'
import {explain as explainMomentary, execute as executeMomentary} from './momentary'
import {explain as explainOrb, execute as executeOrb} from './orb'
import {explain as explainOrbOfHolyLight, execute as executeOrbOfHolyLight} from './orbOfHolyLight'
import {explain as explainPsychicWarfare, execute as executePsychicWarfare} from './psychicWarfare'
import {explain as explainQueue, execute as executeQueue} from './queue'
import {explain as explainRequire, execute as executeRequire} from './require'
import {explain as explainSmite, execute as executeSmite} from './smite'
import {explain as explainText, execute as executeText} from './text'
// @endindex
export type { Locals } from './util'

export const explainers: Explainers = {
    // @index(['./*.ts'], (f, _) => `${f.name}: explain${_.pascalCase(f.name)},`)
    addBlock: explainAddBlock,
    addBlockToSelf: explainAddBlockToSelf,
    addEnergy: explainAddEnergy,
    addEnergyPerRound: explainAddEnergyPerRound,
    bellyFlop: explainBellyFlop,
    chain: explainChain,
    choice: explainChoice,
    deal: explainDeal,
    dealFromStance: explainDealFromStance,
    discard: explainDiscard,
    doubleEnchantmentOrToken: explainDoubleEnchantmentOrToken,
    draw: explainDraw,
    dwindle: explainDwindle,
    effect: explainEffect,
    effectAll: explainEffectAll,
    ifDamageDealt: explainIfDamageDealt,
    ifDamageDealtApplyEffect: explainIfDamageDealtApplyEffect,
    ifFirstPlay: explainIfFirstPlay,
    ifStance: explainIfStance,
    killIf: explainKillIf,
    mimicAttack: explainMimicAttack,
    modifyStats: explainModifyStats,
    momentary: explainMomentary,
    orb: explainOrb,
    orbOfHolyLight: explainOrbOfHolyLight,
    psychicWarfare: explainPsychicWarfare,
    queue: explainQueue,
    require: explainRequire,
    smite: explainSmite,
    text: explainText,
    // @endindex
}

export const executors: Executors = {
    // @index(['./*.ts'], (f, _) => `${f.name}: execute${_.pascalCase(f.name)},`)
    addBlock: executeAddBlock,
    addBlockToSelf: executeAddBlockToSelf,
    addEnergy: executeAddEnergy,
    addEnergyPerRound: executeAddEnergyPerRound,
    bellyFlop: executeBellyFlop,
    chain: executeChain,
    choice: executeChoice,
    deal: executeDeal,
    dealFromStance: executeDealFromStance,
    discard: executeDiscard,
    doubleEnchantmentOrToken: executeDoubleEnchantmentOrToken,
    draw: executeDraw,
    dwindle: executeDwindle,
    effect: executeEffect,
    effectAll: executeEffectAll,
    ifDamageDealt: executeIfDamageDealt,
    ifDamageDealtApplyEffect: executeIfDamageDealtApplyEffect,
    ifFirstPlay: executeIfFirstPlay,
    ifStance: executeIfStance,
    killIf: executeKillIf,
    mimicAttack: executeMimicAttack,
    modifyStats: executeModifyStats,
    momentary: executeMomentary,
    orb: executeOrb,
    orbOfHolyLight: executeOrbOfHolyLight,
    psychicWarfare: executePsychicWarfare,
    queue: executeQueue,
    require: executeRequire,
    smite: executeSmite,
    text: executeText,
    // @endindex
}

// main remaining card verbs: doubleEnchantmentOrToken, choice
//  - ones with weird choice / target selection: arcanePower, prayerOfGoodFortune

// remaining verbs from enemies: mimicAttack, dot, ifDamageDealt, damageTaken, rest, matchaMeld, summon
