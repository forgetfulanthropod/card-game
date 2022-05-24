import type { Value as VAngu } from 'angu'
import * as angu from 'angu'
import type { BattleCursor, CharacterUid, Command } from 'shared'
import { entryMap } from 'shared/code'
import { explainers, executors } from './commands'
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
    const ctx = generateAnguContext(explainers)

    return angu.evaluate(actions, ctx, locals).value
}

// function getCommandOutcome({
//     command,
//     targetUids,
//     scene,
//     locals
// })

function executeActions({
    command,
    targetUids,
    scene,
    locals,
}: {
    command: Command
    targetUids: CharacterUid[]
    scene: BattleCursor
    locals?: object
}): void {
    // TODO?: change to * import + loop?
    const wrappedExecutors = entryMap(
        executors,
        (_, func) =>
            (...dslArgs: VAngu[]) =>
                func({ dslArgs, command, targetUids, scene })
    )
    const ctx = generateAnguContext(wrappedExecutors)

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
