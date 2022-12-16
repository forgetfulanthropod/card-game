import type {
    CharacterUid,
    NextCommand,
    NpcCommandId,
    TargetType,
} from 'shared'
import { datum } from 'datums'
import {
    Explanation,
    ExplanationIf,
    KeyTerm,
    keyTermsMap,
    TermExplanationIf,
} from '@sharedElements'
import { TermExplanation } from '@sharedElements'
import { highlightIntentFrom, toDatum } from '@/util'
import {
    Adjust,
    AssetKey,
    DisplayObject,
    IntentAssetKey,
    InteractionEvents,
    PixiContainer,
} from '@/elementsUtil'
import {
    If,
    glowFilter,
    Container,
    For,
    getTexture,
    Sprite,
    Text,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { startCase } from 'lodash'

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
        index => ({ x: (index * INTENT_ICON_WIDTH) / 2 })
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
        ...(!isFriendlyIntent && effects
            ? DebuffIntended(targetCharacterUid, nextCmd)
            : []),
        ...(!isFriendlyIntent && damage ? DamageIntended(damage, nextCmd) : []),
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

const commandIdToMetaMap: Record<
    (NpcCommandId & KeyTerm) | NpcCommandId,
    { id: NpcCommandId; src?: IntentAssetKey; explanation?: string[] }
> = {
    ancientStrike: {
        id: 'ancientStrike',
    },
    basicAttack: {
        id: 'basicAttack',
    },
    bigBomb1: {
        id: 'bigBomb1',
        src: 'intentBigBomb1',
    },
    bigBomb2: {
        id: 'bigBomb2',
        src: 'intentBigBomb2',
    },
    block: {
        id: 'block',
    },
    bucketOfBangSnaps: {
        id: 'bucketOfBangSnaps',
    },
    chomp: {
        id: 'chomp',
    },
    demolitionCharge: {
        id: 'demolitionCharge',
    },
    evisceratingSweep: {
        id: 'evisceratingSweep',
    },
    fireCracker: {
        id: 'fireCracker',
    },
    gnomeBomb: {
        id: 'gnomeBomb',
    },
    grudge: {
        id: 'grudge',
        src: 'intentGrudge',
    },
    hansBuffBlock: {
        id: 'hansBuffBlock',
    },
    hansCurse: {
        id: 'hansCurse',
    },
    hansGuards: {
        id: 'hansGuards',
    },
    hansMagicMissile: {
        id: 'hansMagicMissile',
    },
    itchyOozeSpecial: {
        id: 'itchyOozeSpecial',
    },
    jab: {
        id: 'jab',
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
    matchaMadness: {
        id: 'matchaMadness',
    },
    matchaMash: {
        id: 'matchaMash',
    },
    matchaMeld: {
        id: 'matchaMeld',
    },
    mimicAttack: {
        id: 'mimicAttack',
        src: 'intentMimic',
        explanation: ['copies last hit this turn or deals 999'],
    },
    passiveBlockCmd: {
        id: 'passiveBlockCmd',
    },
    rest: {
        id: 'rest',
    },
    rustyPokeHigh: {
        id: 'rustyPokeHigh',
    },
    rustyPokeLow: {
        id: 'rustyPokeLow',
    },
    slash: {
        id: 'slash',
    },
    strike: {
        id: 'strike',
    },
    swordWack: {
        id: 'swordWack',
    },
    yodel: {
        id: 'yodel',
    },
}

function DamageIntended(amount: number, command: NextCommand): DisplayObject[] {
    const { commandMeta, events, infoBox } = getCommandObjects(command)

    return [
        Container(
            {},
            ...(commandMeta.src
                ? [
                      Sprite({
                          scale:
                              INTENT_ICON_WIDTH /
                              getTexture(commandMeta.src).width,
                          src: getTexture(commandMeta.src),
                          anchor: 0.4,
                          events,
                      }),
                  ]
                : []),
            Sprite({
                scale: INTENT_ICON_WIDTH / getTexture('intentAttack').width,
                src: getTexture('intentAttack'),
                anchor: 0.4,
                events,
                x: commandMeta.src ? -50 : 0,
            }),
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
            infoBox
        ),
    ]
}

function DebuffIntended(
    targetCharacterUid: CharacterUid,
    command: NextCommand
) {
    const { commandMeta, events, infoBox } = getCommandObjects(command)

    return [
        Container(
            {
                x: 60,
            },
            Sprite({
                scale: INTENT_ICON_WIDTH / getTexture('intentBuff').width,
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
                x: -340,
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
                x: -380,
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
    const commandMeta =
        commandIdToMetaMap[command.command.id as NpcCommandId] ?? {}

    const xOffset = 65

    const isHoveringIntent = datum(false)
    let infoBox = commandMeta.explanation
        ? ExplanationIf({
              isShown: isHoveringIntent,
              texts: [startCase(commandMeta.id), ...commandMeta.explanation],
              xOffset,
              isHtml: true,
          })
        : Object.hasOwn(keyTermsMap, commandMeta.id)
        ? TermExplanationIf({
              isShown: isHoveringIntent,
              term: commandMeta.id as KeyTerm,
              xOffset,
          })
        : ExplanationIf({
              isShown: isHoveringIntent,
              texts: [startCase(command.command.id)],
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
