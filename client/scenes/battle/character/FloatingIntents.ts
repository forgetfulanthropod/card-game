import type {
    CharacterUid,
    NextCommand,
    NpcCommandId,
    TargetType,
} from 'shared'
import { datum, RODatum } from 'datums'
import {
    ExplanationIf,
    KeyTerm,
    keyTermsMap,
    TermExplanationIf,
} from '@sharedElements'
import { TermExplanation } from '@sharedElements'
import { highlightIntentFrom, toDatum } from '@/util'
import {
    Adjust,
    DisplayObject,
    IntentAssetKey,
    InteractionEvents,
    PixiContainer,
} from '@/elementsUtil'
import {
    glowFilter,
    Container,
    For,
    getTexture,
    Sprite,
    Text,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { startCase } from 'lodash'
import { IntentArrows } from './NpcIntentArrow'

const INTENT_ICON_WIDTH = 66

export function FloatingIntents(cuid: CharacterUid): PixiContainer {
    return For(
        toDatum(getBattleScene().select('nextNpcCommands'), nextNpcCommands =>
            nextNpcCommands == null
                ? []
                : nextNpcCommands
                      .filter(cmd => cmd.targetUids.includes(cuid))
                      .map(cmd => ({
                          key:
                              cmd.command.characterUid +
                              Math.random().toString(),
                          ...cmd,
                      }))
        ),
        nextCmd => FloatingIntent(nextCmd, cuid),
        index => ({ x: index * INTENT_ICON_WIDTH })
    )
}

function FloatingIntent(
    nextCmd: NextCommand,
    targetCharacterUid: CharacterUid
): DisplayObject {
    if (nextCmd == null) throw new Error("it's broken")

    const block = nextCmd.outcome.blocks[targetCharacterUid] ?? 0
    const damage = (nextCmd.outcome.damages[targetCharacterUid] ?? 0) - block
    const effects = nextCmd.outcome.effects[targetCharacterUid]

    // intents on player characters never friendly?
    const isFriendlyIntent = !getBattleScene().get(
        'allCharacters',
        targetCharacterUid,
        'isPc'
    )

    const children = [
        ...(isFriendlyIntent && effects ? BuffIntended(nextCmd) : []),
        ...(block > 0 ? BlockIntended(block, nextCmd) : []),
        ...(!isFriendlyIntent && effects ? DebuffIntended(nextCmd) : []),
        ...(!isFriendlyIntent ? DamageIntended(damage, nextCmd) : []),
    ]

    const root = Container(
        {
            events: {
                pointerover: interact,
                pointerdown: interact,
                pointerup: stopInteracting,
                pointerout: stopInteracting,
            },
        },
        ...children
    )

    return root

    function interact() {
        highlightIntentFrom.set(nextCmd.command.characterUid)
        root.filters = [glowFilter]
    }

    function stopInteracting() {
        highlightIntentFrom.set(null)
        root.filters = []
    }
}

const commandIdToMetaMap: Partial<
    Record<
        (NpcCommandId & KeyTerm) | NpcCommandId,
        { id: NpcCommandId; src?: IntentAssetKey; explanation?: string[] }
    >
> = {
    bigBomb1: {
        id: 'bigBomb1',
        src: 'intentBigBomb1',
        explanation: ['Gnome Big Bomber is charging his Big Bomb'],
    },
    bigBomb2: {
        id: 'bigBomb2',
        src: 'intentBigBomb2',
        explanation: ['Gnome Big Bomber has charged his Big Bomb'],
    },
    grudge: {
        id: 'grudge',
        src: 'intentGrudge',
    },
    jurgenBellyFlop: {
        id: 'jurgenBellyFlop',
        src: 'intentBellyFlop',
        explanation: [
            'Bosshog Jürgen will attempt to attack for 30 damage, but will deal 1 point less for every point of damage he takes.',
        ],
    },
    jurgenRollAround: {
        id: 'jurgenRollAround',
        src: 'intentRollAround',
        explanation: [
            'Bosshog Jürgen will attempt to attack 2 friendly kaiju for 20 damage each, but will deal 1 point less for every point of damage he takes.',
        ],
    },
    jurgenSitUpon: {
        id: 'jurgenSitUpon',
        explanation: [
            'Jürgen sits on one of your characters.  This attack does 60 damage and gives Stun (1) to the target.',
        ],
    },
    jurgenStampSnort: {
        id: 'jurgenStampSnort',
        explanation: ['Bosshog Jürgen will do double damage next turn.'],
    },
    mimicAttack: {
        id: 'mimicAttack',
        src: 'intentMimic',
        explanation: ['copies last hit this turn or deals 999'],
    },
}

function DamageIntended(amount: number, command: NextCommand): DisplayObject[] {
    const { commandMeta, events, infoBox } = getCommandObjects(command)

    if (amount === 0 && commandMeta?.src == null) return []

    return [
        Container(
            {},
            Sprite({
                scale:
                    INTENT_ICON_WIDTH /
                    getTexture(commandMeta?.src ?? 'intentAttack').width,
                src: getTexture(commandMeta?.src ?? 'intentAttack'),
                anchor: commandMeta?.src ? [0.8, 0.4] : 0.4,
                events,
            }),
            ...(amount
                ? [
                      Text({
                          text: `${amount}`,
                          anchor: 0.5,
                          x: commandMeta.src ? -50 : 0,
                          events,
                          style: {
                              fill: 'white',
                              strokeThickness: 5,
                              stroke: 'black',
                              fontFamily: 'sansFont',
                              fontSize: 24,
                          },
                      }),
                  ]
                : []),
            infoBox
        ),
    ]
}

function DebuffIntended(command: NextCommand) {
    const { commandMeta, events, infoBox } = getCommandObjects(command)

    return [
        Container(
            {
                x: 30,
            },
            Sprite({
                scale: INTENT_ICON_WIDTH / getTexture('intentDebuff').width,
                src: 'intentDebuff',
                anchor: 0.4,
                events,
            }),
            infoBox
        ),
    ]
}

function BuffIntended(command: NextCommand) {
    const { events, infoBox } = getCommandObjects(command)

    return [
        Container(
            {
                y: -190,
                x: -40,
            },
            Sprite({
                scale: INTENT_ICON_WIDTH / getTexture('intentBuff').width,
                src: 'intentBuff',
                anchor: 0.2,
                events,
            }),
            infoBox
        ),
    ]
}

function BlockIntended(amount: number, command: NextCommand) {
    const isHoveringIntent = datum(false)

    return [
        Container(
            {
                y: -190,
                x: -80,
            },
            Sprite({
                scale: INTENT_ICON_WIDTH / getTexture('intentBlock').width,
                src: 'intentBlock',
                anchor: 0.2,
                events: {
                    pointerover() {
                        isHoveringIntent.set(true)
                    },
                    pointerdown() {
                        isHoveringIntent.set(true)
                    },
                    pointerout() {
                        isHoveringIntent.set(false)
                    },
                },
            }),
            Text({
                text: `${amount ?? '?'}`,
                anchor: 0.5,
                style: {
                    fill: 'white',
                    strokeThickness: 5,
                    stroke: 0,
                    fontFamily: 'sansFont',
                },
            }),
            ExplanationIf({
                isShown: isHoveringIntent,
                texts: [`intends to block for ${amount}`],
                xOffset: 65,
            })
        ),
    ]
}

function getCommandObjects(command: NextCommand) {
    const commandId = command.command.id
    const commandMeta =
        commandIdToMetaMap[commandId as NpcCommandId] ??
        ({} as { id: NpcCommandId; src?: IntentAssetKey; explanation?: string })

    const xOffset = 65

    const isHoveringIntent = datum(false)
    let infoBox = commandMeta.explanation
        ? ExplanationIf({
              isShown: isHoveringIntent,
              texts: [
                  startCase(commandId).replace(/[0-9]/g, ''),
                  ...commandMeta.explanation,
              ],
              xOffset,
              isHtml: true,
          })
        : Object.hasOwn(keyTermsMap, commandId)
        ? TermExplanationIf({
              isShown: isHoveringIntent,
              term: commandId as KeyTerm,
              xOffset,
          })
        : ExplanationIf({
              isShown: isHoveringIntent,
              texts: [startCase(commandId)],
              xOffset,
              isHtml: true,
          })

    infoBox = Adjust(infoBox, {
        y: -30,
    })

    const events: InteractionEvents = {
        pointerover() {
            isHoveringIntent.set(true)
        },
        pointerdown() {
            isHoveringIntent.set(true)
        },
        pointerout() {
            isHoveringIntent.set(false)
        },
    }
    return { commandMeta, events, infoBox }
}
