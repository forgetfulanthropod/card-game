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
import { extractBlocks, extractDamages, extractEffects } from './outcomeUtil'
import { standardOperators } from './standardOperators'
import type { ExplainerContext } from './commands/util'
import type { EntryCursor } from '@/util'
import { clearHappened, emit, getHappened } from '@/util'
import {
    calculateStats,
    emitMove,
    getCharacterMeta,
    maybeTransitionBattleState,
} from '@/gameState'

export function interpretCommand(args: CommandDetail): void {
    const locals = localsFromCommand(args)
    if (locals.isSkipped) return

    emitMove({
        moveName: args.command.name,
        characterUid: args.command.characterUid,
        targetType: args.command.targetType,
        targetUids: args.targetUids,
        scene: args.scene,
    })

    executeCommand({ ...args, locals })
}

function localsFromCommand(
    args:
        | CommandDetail
        | (Omit<CommandDetail, 'scene'> & { scene: BattleCursor | EntryCursor })
): Locals {
    const { scene, command, targetUids } = args
    const cardOwner =
        (scene as BattleCursor).get('allCharacters', command.characterUid) ??
        (scene as EntryCursor)
            .get('selectedCharacters')
            ?.find(c => c?.uid === command.characterUid)

    const targetHealth =
        targetUids.length === 1
            ? (scene as BattleCursor).get('allCharacters', targetUids[0])
                  ?.health
            : undefined

    const incomingDamageIntended =
        (scene as BattleCursor)
            .get('nextNpcCommands')
            ?.reduce(
                (sum, command) => sum + command.outcome.damages[targetUids[0]],
                0
            ) ?? 0

    const handSize = Object.keys(
        (scene as BattleCursor).get('cards', 'hand') ?? {}
    ).length
    const drawPileSize = Object.keys(
        (scene as BattleCursor).get('cards', 'draw') ?? {}
    ).length
    const discardPileSize = Object.keys(
        (scene as BattleCursor).get('cards', 'discard') ?? {}
    ).length

    return {
        ...calculateStats(cardOwner),
        targetHealth,
        incomingDamageIntended,
        handSize,
        drawPileSize,
        discardPileSize,
    }
}

export function explainCommand(
    command: Command | Card,
    scene: BattleCursor | EntryCursor
): string {
    const context: ExplainerContext = {
        scene:
            (scene as BattleCursor).get('turnCount') != null
                ? (scene as BattleCursor)
                : undefined,
        command,
        characterMeta: getCharacterMeta(scene, command.characterUid),
    }

    const res = explainActions(
        command.actions,
        localsFromCommand({ command, scene, targetUids: [] }),
        context
    )
    if (typeof res !== 'string') {
        logger.error(['non-string result:', res])
        return 'error!'
    }
    return res
}

export function explainActions(
    actions: string,
    locals: object,
    context: ExplainerContext
): string {
    const wrappedExplainers = entryMap(
        explainers,
        (_, func) =>
            (...args: VAngu[]) =>
                // @ts-expect-error
                func(args, context)
    )
    try {
        const ctx = generateAnguContext(wrappedExplainers)

        return angu.evaluate(actions, ctx, locals).value
    } catch (e) {
        logger.warn(['[explainActions] angu error:', e])
        return 'error!'
    }
}

interface CommandDetail {
    command: Command | Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}

/** Does not modify game state (or shouldn't) */
export function simulateCommand(args: CommandDetail): CommandOutcome {
    const locals = localsFromCommand(args)
    if (locals.isSkipped) return { damages: {}, blocks: {}, effects: {} }
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
    const effects = extractEffects(args.scene.get(), sceneCopy.get())
    return { damages, blocks, effects }
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

    try {
        const ctx = generateAnguContext(wrappedExecutors)
        const output = angu.evaluate(command.actions, ctx, locals)
        if (output.kind === 'err') {
            logger.error([
                'error in command:',
                command.actions,
                command.id,
                output.value,
            ])
            // throw Error(jss`error in command: ${output.value}`)
        }
    } catch (e) {
        logger.error(['error in command:', command.actions, command.id])
    }

    maybeTransitionBattleState(scene)
}

function generateAnguContext(actionsMap: object): angu.Context {
    return {
        scope: {
            '='(a: VAngu, b: VAngu) {
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
        precedence: [
            ['/', '*'],
            ['-', '+'],
            ['pow', 'log10'],
            { ops: ['='], associativity: 'right' },
            [';'],
        ],
    }
}
