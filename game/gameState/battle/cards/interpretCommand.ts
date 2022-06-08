import type { Value as VAngu } from 'angu'
import * as angu from 'angu'
import { SBaobab } from 'sbaobab'
import type {
    BattleCursor,
    Card,
    CharacterUid,
    Command,
    CommandOutcome,
} from 'shared'
import { entryMap } from 'shared/code'
import type { Locals } from './commands'
import { executors, explainers } from './commands'
import { extractBlocks, extractDamages } from './outcomeUtil'
import { standardOperators } from './standardOperators'
import { clearHappened, emit, getHappened } from '@/util'
import { calcPostEffectStats, maybeTransitionBattleState } from '@/gameState'

export function interpretCommand(args: CommandDetail): void {
    const locals = localsFromCommand(args)
    if (locals.isSkipped) return
    // const explanation = explainActions(command.actions, locals)
    executeCommand({ ...args, locals })
}

function localsFromCommand(args: CommandDetail): Locals {
    const { scene, command, targetUids } = args
    const cardOwner = scene.get('allCharacters', command.characterUid)
    const targetHealth =
        targetUids.length === 1
            ? scene.get('allCharacters', targetUids[0])?.health
            : undefined
    return { ...calcPostEffectStats(cardOwner), targetHealth }
}

export function explainCommand(command: Command, scene: BattleCursor): string {
    const res = explainActions(
        command.actions,
        localsFromCommand({ command, scene, targetUids: [] })
    )
    if (typeof res !== 'string') {
        logger.error(['non-string result:', res])
        return 'error!'
    }
    return res
}

export function explainActions(actions: string, locals?: object): string {
    const wrappedExplainers = entryMap(
        explainers,
        (_, func) =>
            (...args: VAngu[]) =>
                // @ts-expect-error
                func(args)
    )
    const ctx = generateAnguContext(wrappedExplainers)

    return angu.evaluate(actions, ctx, locals).value
}

interface CommandDetail {
    command: Command | Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}

/** Does not modify game state (or shouldn't) */
export function simulateCommand(args: CommandDetail): CommandOutcome {
    const locals = localsFromCommand(args)
    if (locals.isSkipped) return { damages: {}, blocks: {} }
    const sceneCopy = new SBaobab(args.scene.deepClone()).select()
    const username = args.scene.get('username')
    const happened = getHappened(username)
    executeCommand({ ...args, locals, scene: sceneCopy })
    clearHappened(username)
    for (const event of happened) {
        emit({ username, event })
    }
    const damages = extractDamages(args.scene.get(), sceneCopy.get())
    const blocks = extractBlocks(args.scene.get(), sceneCopy.get())
    return { damages, blocks }
}

function executeCommand({
    command,
    targetUids,
    scene,
    locals,
}: CommandDetail & { locals: Locals }): void {
    const cardUid = 'uid' in command ? command?.['uid'] : undefined
    const wrappedExecutors = entryMap(
        executors,
        (_, func) =>
            (...dslArgs: VAngu[]) =>
                func({
                    // @ts-expect-error
                    dslArgs,
                    command,
                    targetUids,
                    scene,
                    calculatedStats: locals,
                    cardUid,
                })
    )
    const ctx = generateAnguContext(wrappedExecutors)

    angu.evaluate(command.actions, ctx, locals)

    maybeTransitionBattleState(scene)
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
