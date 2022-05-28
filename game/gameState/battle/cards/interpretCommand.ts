import type { Value as VAngu } from 'angu'
import * as angu from 'angu'
import type {
    BattleCursor,
    CalculatedCharacterStats,
    CharacterUid,
    Command,
    CommandOutcome,
} from 'shared'
import { entryMap } from 'shared/code'
import { SBaobab } from 'sbaobab'
import { explainers, executors } from './commands'
import { extractDamages } from './outcomeUtil'
import { calcPostEffectStats, checkBattleOverMut } from '@/gameState'
import { clearHappened, emit, getHappened } from '@/util'

export function interpretCommand({
    command,
    targetUids,
    scene,
}: CommandDetail): void {
    const locals = localsFromCommand(command, scene)
    if (locals.isSkipped) return
    // const explanation = explainActions(command.actions, locals)
    executeCommand({ command, targetUids, scene, locals })
}

type Locals = CalculatedCharacterStats
function localsFromCommand(command: Command, scene: BattleCursor): Locals {
    const cardOwner = scene.get('allCharacters', command.characterUid)
    return calcPostEffectStats(cardOwner)
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
    return explainActions(command.actions, localsFromCommand(command, scene))
}

export function explainActions(actions: string, locals?: object) {
    const ctx = generateAnguContext(explainers)

    return angu.evaluate(actions, ctx, locals).value
}

interface CommandDetail {
    command: Command
    targetUids: CharacterUid[]
    scene: BattleCursor
}

/** Does not modify game state (or shouldn't) */
export function simulateCommand(args: CommandDetail): CommandOutcome {
    const locals = localsFromCommand(args.command, args.scene)
    if (locals.isSkipped) return { damages: {} }
    const sceneCopy = new SBaobab(args.scene.deepClone()).select()
    const username = args.scene.get('username')
    const happened = getHappened(username)
    executeCommand({ ...args, locals, scene: sceneCopy })
    clearHappened(username)
    for (const event of happened) {
        emit({ username, event })
    }
    const damages = extractDamages(args.scene.get(), sceneCopy.get())
    return { damages }
}

function executeCommand({
    command,
    targetUids,
    scene,
    locals,
}: CommandDetail & { locals: Locals }): void {
    const wrappedExecutors = entryMap(
        executors,
        (_, func) =>
            (...dslArgs: VAngu[]) =>
                func({
                    dslArgs,
                    command,
                    targetUids,
                    scene,
                    calculatedStats: locals,
                })
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
