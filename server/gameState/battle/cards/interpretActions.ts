import type { Card, CharacterUid } from '@shared'
import type { Value as VAngu } from 'angu'
import * as angu from 'angu'

import type { BattleCursor } from '@/util'

import { checkBattleOver } from '..'
// @index(['./cardActions/*.ts'], (f, _) => `import {explain as explain${_.pascalCase(f.name)}} from '${f.path}'\nimport {execute as execute${_.pascalCase(f.name)}} from '${f.path}'`)
import {explain as explainAddBlock} from './cardActions/addBlock'
import {execute as executeAddBlock} from './cardActions/addBlock'
import {explain as explainChain} from './cardActions/chain'
import {execute as executeChain} from './cardActions/chain'
import {explain as explainDeal} from './cardActions/deal'
import {execute as executeDeal} from './cardActions/deal'
import {explain as explainDebilitate} from './cardActions/debilitate'
import {execute as executeDebilitate} from './cardActions/debilitate'
// @endindex

export function interpretActions({
    card,
    targetUids,
    scene,
}: {
    card: Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    const locals = localsFromCard(card, scene)
    const explanation = explainActions(card.actions, locals)
    //DEBUG
    console.log(explanation)
    //END DEBUG
    executeActions({ card, targetUids, scene, locals })
}

function localsFromCard(card: Card, scene: BattleCursor) {
    const cardOwner = scene.get('allCharacters', card.characterUid)
    return {
        strength: cardOwner.strength,
        dexterity: cardOwner.dexterity,
        magic: cardOwner.magic,
        constitution: cardOwner.constitution,
        block: cardOwner.block,
    }
}

const standardOperators = {
    '-': (a: VAngu, b: VAngu) => a.eval() - b.eval(),
    '+': (a: VAngu, b: VAngu) => a.eval() + b.eval(),
    '/': (a: VAngu, b: VAngu) => a.eval() / b.eval(),
    '*': (a: VAngu, b: VAngu) => a.eval() * b.eval(),

    ';': (a: VAngu, b: VAngu) => {
        a.eval()
        return b.eval()
    },
    PI: 3.14,
}

export function explainActionsForCard(card: Card, scene: BattleCursor) {
    return explainActions(card.actions, localsFromCard(card, scene))
}

export function explainActions(actions: string, locals?: object) {
    const ctx = generateAnguContext({
        // @index(['./cardActions/*.ts'], (f, _) => `${f.name}: explain${_.pascalCase(f.name)},`)
        addBlock: explainAddBlock,
        chain: explainChain,
        deal: explainDeal,
        debilitate: explainDebilitate,
        // @endindex
    })

    return angu.evaluate(actions, ctx, locals).value
}

export function executeActions({
    card,
    targetUids,
    scene,
    locals,
}: {
    card: Card
    targetUids: CharacterUid[]
    scene: BattleCursor
    locals?: object
}) {
    const ctx = generateAnguContext({
        // chain: (...dslArgs: VAngu[]) => executeChain({ dslArgs, targetUids, scene }),
        // @index(['./cardActions/*.ts'], (f, _) => `${f.name}: (...dslArgs: VAngu[]) => execute${_.pascalCase(f.name)}({ dslArgs, card, targetUids, scene }),`)
        addBlock: (...dslArgs: VAngu[]) => executeAddBlock({ dslArgs, card, targetUids, scene }),
        chain: (...dslArgs: VAngu[]) => executeChain({ dslArgs, card, targetUids, scene }),
        deal: (...dslArgs: VAngu[]) => executeDeal({ dslArgs, card, targetUids, scene }),
        debilitate: (...dslArgs: VAngu[]) => executeDebilitate({ dslArgs, card, targetUids, scene }),
        // @endindex
    })

    angu.evaluate(card.actions, ctx, locals)

    checkBattleOver(scene)
}

function generateAnguContext(actionsMap: object): angu.Context {
    return {
        scope: {
            '=': function (a: VAngu, b: VAngu) {
                const resB = b.eval()
                if (a.kind() === 'variable') {
                    this.context.scope[a.name()] = resB
                } else {
                    throw Error(
                        `Assignment expected a variable on the left but got a ${a.kind()}`
                    )
                }
                return resB
            },
            ...standardOperators,
            ...actionsMap,
        },
        precedence: [['-', '+'], ['='], ['chain', 'deal', 'debilitate'], [';']],
    }
}
