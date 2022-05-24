import type { Value as VAngu } from 'angu'
import * as angu from 'angu'
import type { BattleCursor, CharacterUid, Command } from 'shared'
import {
    executeAddBlock,
    executeChain,
    executeDeal,
    executeDebilitate,
    executeOrb,
    executeText,
    explainAddBlock,
    explainChain,
    explainDeal,
    explainDebilitate,
    explainOrb,
    explainText,
} from './commands'
import { checkBattleOverMut } from '@/gameState'

export function interpretCommand({
    command,
    targetUids,
    scene,
}: {
    command: Command
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    const locals = localsFromCard(command, scene)
    // const explanation = explainActions(command.actions, locals)
    executeActions({ command, targetUids, scene, locals })
}

function localsFromCard(command: Command, scene: BattleCursor) {
    const cardOwner = scene.get('allCharacters', command.characterUid)
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

export function explainCommand(command: Command, scene: BattleCursor) {
    return explainActions(command.actions, localsFromCard(command, scene))
}

export function explainActions(actions: string, locals?: object) {
    const ctx = generateAnguContext({
        // @index(['./commands/*.ts', '!./commands/index.ts'], (f, _) => `${f.name}: explain${_.pascalCase(f.name)},`)
        addBlock: explainAddBlock,
        chain: explainChain,
        deal: explainDeal,
        debilitate: explainDebilitate,
        orb: explainOrb,
        text: explainText,
        // @endindex
    })

    return angu.evaluate(actions, ctx, locals).value
}

function executeActions({
    command,
    targetUids,
    scene,
    locals,
}: // dry,
{
    command: Command
    targetUids: CharacterUid[]
    scene: BattleCursor
    locals?: object
    // dry?: boolean
}): void {
    // TODO?: change to * import + loop?
    const ctx = generateAnguContext({
        // chain: (...dslArgs: VAngu[]) => executeChain({ dslArgs, targetUids, scene }),
        // @index(['./commands/*.ts', '!./commands/index.ts'], (f, _) => `${f.name}: (...dslArgs: VAngu[]) => execute${_.pascalCase(f.name)}({ dslArgs, command, targetUids, scene }),`)
        addBlock: (...dslArgs: VAngu[]) =>
            executeAddBlock({ dslArgs, command, targetUids, scene }),
        chain: (...dslArgs: VAngu[]) =>
            executeChain({ dslArgs, command, targetUids, scene }),
        deal: (...dslArgs: VAngu[]) =>
            executeDeal({ dslArgs, command, targetUids, scene }),
        debilitate: (...dslArgs: VAngu[]) =>
            executeDebilitate({ dslArgs, command, targetUids, scene }),
        orb: (...dslArgs: VAngu[]) =>
            executeOrb({ dslArgs, command, targetUids, scene }),
        text: (...dslArgs: VAngu[]) =>
            executeText({ dslArgs, command, targetUids, scene }),
        // @endindex
    })

    angu.evaluate(command.actions, ctx, locals)

    checkBattleOverMut(scene)
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
