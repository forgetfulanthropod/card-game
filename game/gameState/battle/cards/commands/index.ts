import type { Executors, Explainers } from './util'
// @index(['./*.ts'], (f, _) => `import {explain as explain${pascalCase(f.name)}, execute as execute${pascalCase(f.name)}} from '${f.path}'`)
import {explain as explainAddBlock, execute as executeAddBlock} from './addBlock'
import {explain as explainAddEnergy, execute as executeAddEnergy} from './addEnergy'
import {explain as explainAddEnergyPerRound, execute as executeAddEnergyPerRound} from './addEnergyPerRound'
import {explain as explainBellyFlop, execute as executeBellyFlop} from './bellyFlop'
import {explain as explainBrittle, execute as executeBrittle} from './brittle'
import {explain as explainChain, execute as executeChain} from './chain'
import {explain as explainChoice, execute as executeChoice} from './choice'
import {explain as explainDeal, execute as executeDeal} from './deal'
import {explain as explainDealFromStance, execute as executeDealFromStance} from './dealFromStance'
import {explain as explainDiscard, execute as executeDiscard} from './discard'
import {explain as explainDiscardRandom, execute as executeDiscardRandom} from './discardRandom'
import {explain as explainDoubleEnchantmentOrToken, execute as executeDoubleEnchantmentOrToken} from './doubleEnchantmentOrToken'
import {explain as explainDraw, execute as executeDraw} from './draw'
import {explain as explainDrawSizeChange, execute as executeDrawSizeChange} from './drawSizeChange'
import {explain as explainDwindle, execute as executeDwindle} from './dwindle'
import {explain as explainEffect, execute as executeEffect} from './effect'
import {explain as explainExplain, execute as executeExplain} from './explain'
import {explain as explainHeal, execute as executeHeal} from './heal'
import {explain as explainIfDamageDealt, execute as executeIfDamageDealt} from './ifDamageDealt'
import {explain as explainIfDamageDealtApplyEffect, execute as executeIfDamageDealtApplyEffect} from './ifDamageDealtApplyEffect'
import {explain as explainIfFirstPlay, execute as executeIfFirstPlay} from './ifFirstPlay'
import {explain as explainIfHealthUnder, execute as executeIfHealthUnder} from './ifHealthUnder'
import {explain as explainIfKilled, execute as executeIfKilled} from './ifKilled'
import {explain as explainIfStance, execute as executeIfStance} from './ifStance'
import {explain as explainIfStanceElse, execute as executeIfStanceElse} from './ifStanceElse'
import {explain as explainInfectiousBite, execute as executeInfectiousBite} from './infectiousBite'
import {explain as explainKillIf, execute as executeKillIf} from './killIf'
import {explain as explainMimicAttack, execute as executeMimicAttack} from './mimicAttack'
import {explain as explainModifyStats, execute as executeModifyStats} from './modifyStats'
import {explain as explainMomentary, execute as executeMomentary} from './momentary'
import {explain as explainOrb, execute as executeOrb} from './orb'
import {explain as explainOrbOfHolyLight, execute as executeOrbOfHolyLight} from './orbOfHolyLight'
import {explain as explainPsychicWarfare, execute as executePsychicWarfare} from './psychicWarfare'
import {explain as explainQueue, execute as executeQueue} from './queue'
import {explain as explainRemoveAllDebuffs, execute as executeRemoveAllDebuffs} from './removeAllDebuffs'
import {explain as explainRequire, execute as executeRequire} from './require'
import {explain as explainSetStance, execute as executeSetStance} from './setStance'
import {explain as explainSmite, execute as executeSmite} from './smite'
import {explain as explainHypnotize, execute as executeHypnotize} from './hypnotize'
import {explain as explainText, execute as executeText} from './text'
// @endindex
export type { Locals } from './util'

export const explainers: Explainers = {
    // @index(['./*.ts'], (f, _) => `${f.name}: explain${_.pascalCase(f.name)},`)
    addBlock: explainAddBlock,
    addEnergy: explainAddEnergy,
    addEnergyPerRound: explainAddEnergyPerRound,
    bellyFlop: explainBellyFlop,
    brittle: explainBrittle,
    chain: explainChain,
    choice: explainChoice,
    deal: explainDeal,
    dealFromStance: explainDealFromStance,
    discard: explainDiscard,
    discardRandom: explainDiscardRandom,
    doubleEnchantmentOrToken: explainDoubleEnchantmentOrToken,
    draw: explainDraw,
    drawSizeChange: explainDrawSizeChange,
    dwindle: explainDwindle,
    effect: explainEffect,
    explain: explainExplain,
    heal: explainHeal,
    hypnotize: explainHypnotize,
    ifDamageDealt: explainIfDamageDealt,
    ifDamageDealtApplyEffect: explainIfDamageDealtApplyEffect,
    ifFirstPlay: explainIfFirstPlay,
    ifHealthUnder: explainIfHealthUnder,
    ifKilled: explainIfKilled,
    ifStance: explainIfStance,
    ifStanceElse: explainIfStanceElse,
    infectiousBite: explainInfectiousBite,
    killIf: explainKillIf,
    mimicAttack: explainMimicAttack,
    modifyStats: explainModifyStats,
    momentary: explainMomentary,
    orb: explainOrb,
    orbOfHolyLight: explainOrbOfHolyLight,
    psychicWarfare: explainPsychicWarfare,
    queue: explainQueue,
    removeAllDebuffs: explainRemoveAllDebuffs,
    require: explainRequire,
    setStance: explainSetStance,
    smite: explainSmite,
    text: explainText,
    // @endindex
}

export const executors: Executors = {
    // @index(['./*.ts'], (f, _) => `${f.name}: execute${_.pascalCase(f.name)},`)
    addBlock: executeAddBlock,
    addEnergy: executeAddEnergy,
    addEnergyPerRound: executeAddEnergyPerRound,
    bellyFlop: executeBellyFlop,
    brittle: executeBrittle,
    chain: executeChain,
    choice: executeChoice,
    deal: executeDeal,
    dealFromStance: executeDealFromStance,
    discard: executeDiscard,
    discardRandom: executeDiscardRandom,
    doubleEnchantmentOrToken: executeDoubleEnchantmentOrToken,
    draw: executeDraw,
    drawSizeChange: executeDrawSizeChange,
    dwindle: executeDwindle,
    effect: executeEffect,
    explain: executeExplain,
    heal: executeHeal,
    hypnotize: executeHypnotize,
    ifDamageDealt: executeIfDamageDealt,
    ifDamageDealtApplyEffect: executeIfDamageDealtApplyEffect,
    ifFirstPlay: executeIfFirstPlay,
    ifHealthUnder: executeIfHealthUnder,
    ifKilled: executeIfKilled,
    ifStance: executeIfStance,
    ifStanceElse: executeIfStanceElse,
    infectiousBite: executeInfectiousBite,
    killIf: executeKillIf,
    mimicAttack: executeMimicAttack,
    modifyStats: executeModifyStats,
    momentary: executeMomentary,
    orb: executeOrb,
    orbOfHolyLight: executeOrbOfHolyLight,
    psychicWarfare: executePsychicWarfare,
    queue: executeQueue,
    removeAllDebuffs: executeRemoveAllDebuffs,
    require: executeRequire,
    setStance: executeSetStance,
    smite: executeSmite,
    text: executeText,
    // @endindex
}

// main remaining card verbs: doubleEnchantmentOrToken, choice
//  - ones with weird choice / target selection: arcanePower, prayerOfGoodFortune

// remaining verbs from enemies: mimicAttack, dot, ifDamageDealt, damageTaken, rest, matchaMeld, summon
