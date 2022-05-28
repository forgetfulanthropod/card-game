// @index(['./*.ts'], (f, _) => `import {explain as explain${pascalCase(f.name)}, execute as execute${pascalCase(f.name)}} from '${f.path}'`)
import {
    explain as explainAddBlock,
    execute as executeAddBlock,
} from './addBlock'
import { explain as explainChain, execute as executeChain } from './chain'
import { explain as explainDeal, execute as executeDeal } from './deal'
import { explain as explainEffect, execute as executeEffect } from './effect'
import { explain as explainOrb, execute as executeOrb } from './orb'
import { explain as explainText, execute as executeText } from './text'
// @endindex

export const explainers = {
    // @index(['./*.ts'], (f, _) => `${f.name}: explain${_.pascalCase(f.name)},`)
    addBlock: explainAddBlock,
    chain: explainChain,
    deal: explainDeal,
    effect: explainEffect,
    orb: explainOrb,
    text: explainText,
    // @endindex
}

export const executors = {
    // @index(['./*.ts'], (f, _) => `${f.name}: execute${_.pascalCase(f.name)},`)
    addBlock: executeAddBlock,
    chain: executeChain,
    deal: executeDeal,
    effect: executeEffect,
    orb: executeOrb,
    text: executeText,
    // @endindex
}
