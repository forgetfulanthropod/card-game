import type { Value as VAngu } from 'angu'
import * as angu from 'angu'
import { SBaobab } from 'sbaobab'
import type {
    BattleCursor,
    Card,
    CharacterUid,
    Command,
    CommandOutcome,
    StanceId,
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
    getLivingPcs,
    maybeTransitionBattleState,
} from '@/gameState'
import { uniq } from 'lodash'

export function interpretCommand(args: CommandDetail, emit = true): void {
    const locals = localsFromCommand(args)
    if (locals.isSkipped) return

    if (emit)
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

    const sceneData = (scene as BattleCursor).get()
    const cardOwner =
        sceneData.allCharacters?.[command.characterUid] ??
        (scene as EntryCursor)
            .get('selectedCharacters')
            ?.find(c => c?.uid === command.characterUid)

    const cardsPlayedThisRoom = sceneData.cardsPlayedThisRoom ?? []
    const lastCardPlayed = cardsPlayedThisRoom[cardsPlayedThisRoom.length - 1]
    const stanceIds =
        sceneData.id === 'battle'
            ? getLivingPcs(sceneData).map(c => c.stance)
            : []

    return {
        ...calculateStats(cardOwner),
        targetConstitution:
            targetUids.length === 1
                ? sceneData.allCharacters[targetUids[0]]?.constitution
                : undefined,
        targetHealth:
            targetUids.length === 1
                ? sceneData.allCharacters[targetUids[0]]?.health
                : undefined,
        targetBlock:
            targetUids.length === 1
                ? sceneData.allCharacters[targetUids[0]]?.block
                : undefined,
        incomingDamageIntended:
            sceneData.nextNpcCommands?.reduce(
                (sum, command) => sum + command.outcome.damages[targetUids[0]],
                0
            ) ?? 0,
        handSize: Object.keys(sceneData.cards?.hand ?? {}).length,
        drawPileSize: Object.keys(sceneData.cards?.draw ?? {}).length,
        discardPileSize: Object.keys(sceneData.cards?.discard ?? {}).length,
        lastCardPlayedType: lastCardPlayed?.type,
        currentRoomCategory: (sceneData.currentRoom ?? {})?.category,
        wasLastCardPlayedFromThisCharacter:
            command.characterUid === lastCardPlayed?.characterUid,
        turnStartStance: cardOwner.stanceInPrevTurn ?? 'neutral',
        allStancesDifferent: uniq(stanceIds).length === stanceIds.length,
        allStancesSame: uniq(stanceIds).length === 1,
    }
}

export function explainCommand(
    command: Command | Card,
    scene: BattleCursor | EntryCursor,
    stance?: StanceId
): string {
    const context: ExplainerContext = {
        scene:
            (scene as BattleCursor).get('turnCount') != null
                ? (scene as BattleCursor)
                : undefined,
        command,
        characterMeta: {
            ...getCharacterMeta(scene, command.characterUid),
            ...(stance ? { stance } : {}),
        },
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
    return `${res}.`
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
export function simulateCommand(
    args: CommandDetail
): [CommandOutcome, BattleCursor] {
    const locals = localsFromCommand(args)
    if (locals.isSkipped)
        return [{ damages: {}, blocks: {}, effects: {} }, args.scene]
    const sceneCopy = new SBaobab(args.scene.deepClone()).select()
    const userId = args.scene.get('userId')
    const happened = getHappened(userId)
    executeCommand({ ...args, locals, scene: sceneCopy })
    clearHappened(userId)
    for (const event of happened) {
        emit({ userId, event })
    }
    const damages = extractDamages(args.scene.get(), sceneCopy.get())
    const blocks = extractBlocks(args.scene.get(), sceneCopy.get())
    const effects = extractEffects(args.scene.get(), sceneCopy.get())
    return [{ damages, blocks, effects }, sceneCopy]
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
            ['<', '<=', '>', '>=', '===', '!==', '==', '!='],
            ['&&'],
            ['||'],
            { ops: ['='], associativity: 'right' },
            [';'],
        ],
    }
}
