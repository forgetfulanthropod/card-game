import type { CharacterUid, NextCommand, NpcCommandId } from 'shared'
import { datum, RODatum } from 'datums'
import {
    ExplanationIf,
    KeyTerm,
    keyTermsMap,
    TermExplanationIf,
} from '@sharedElements'

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
        index => ({ x: index * INTENT_ICON_WIDTH * 1.1 })
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

const commandIdToMetaMap: Record<
    NpcCommandId,
    { id: NpcCommandId; src?: IntentAssetKey; explanation?: string[] }
> = {
    ancientStrike: {
        id: 'ancientStrike',
        explanation: [],
    },
    basicAttack: {
        id: 'basicAttack',
        explanation: [],
    },
    bigBelly: {
        id: 'bigBelly',
        explanation: [],
    },
    bigBomb1: {
        id: 'bigBomb1',
        src: 'intentBigBomb1',
        explanation: [
            'Gnome Big Bomber is charging his Big Bomb',
            'If Gnome Big Bomber loses 40% of their starting health, they gain <b>Debilitated</b> (2).  If they lose 75% or more health, they gain <b>Stun</b> (1)',
        ],
    },
    bigBomb2: {
        id: 'bigBomb2',
        src: 'intentBigBomb2',
        explanation: [
            'Gnome Big Bomber will throw his Big Bomb',
            'If Gnome Big Bomber loses 40% of their starting health, they gain <b>Debilitated</b> (2).  If they lose 75% or more health, they gain <b>Stun</b> (1)',
        ],
    },
    block: {
        id: 'block',
        explanation: [],
    },
    bucketOfBangSnaps: {
        id: 'bucketOfBangSnaps',
        src: 'intentBucketOfBangSnaps',
        explanation: [
            'Applies <b>Unready</b> (2) if any damage goes unblocked',
        ],
    },
    chomp: {
        id: 'chomp',
        explanation: [],
    },
    demolitionCharge: {
        id: 'demolitionCharge',
        explanation: [
            'If any damage goes unblocked, Gnome Prospector gains <b>Berserk</b> (1) and the target gains <b>Unguarded</b> (1)',
        ],
    },
    evisceratingSweep: {
        id: 'evisceratingSweep',
        explanation: [],
    },
    fireCracker: {
        id: 'fireCracker',
        src: 'intentFireCracker',
        explanation: ['Applies <b>Unguarded</b> (2)'],
    },
    gnomeBomb: {
        id: 'gnomeBomb',
        explanation: ['Applies <b>Tired</b> (1) if any damage goes unblocked'],
    },
    grudge: {
        id: 'grudge',
        src: 'intentGrudge',
        explanation: ['Mimic attacks for 25% of the health he has lost.'],
    },
    hansBuffBlock: {
        id: 'hansBuffBlock',
        explanation: [],
    },
    hansCurse: {
        id: 'hansCurse',
        explanation: [],
    },
    hansGuards: {
        id: 'hansGuards',
        explanation: [],
    },
    hansMagicMissile: {
        id: 'hansMagicMissile',
        explanation: [],
    },
    hypnosis: {
        id: 'hypnosis',
        explanation: [],
    },
    itchyOozeSpecial: {
        id: 'itchyOozeSpecial',
        explanation: [],
    },
    jab: {
        id: 'jab',
        explanation: [],
    },
    jurgenBellyFlop: {
        id: 'jurgenBellyFlop',
        src: 'intentBellyFlop',
        explanation: [
            'Bosshog Jürgen deals 1 point less for every point of damage he takes.',
        ],
    },
    jurgenRollAround: {
        id: 'jurgenRollAround',
        src: 'intentRollAround',
        explanation: [
            'Bosshog Jürgen will attack twice but deals 1 point less for every point of damage he takes',
        ],
    },
    jurgenSitUpon: {
        id: 'jurgenSitUpon',
        explanation: [
            'Jürgen sits on and <b>debiliates</b> (2) one of your characters.',
        ],
    },
    jurgenStampSnort: {
        id: 'jurgenStampSnort',
        explanation: [
            'Jürgen gets very angry and stamps around in place.',
            'He does nothing this turn but increases his base attack by 25 the following turn.',
        ],
    },
    roadClosure: {
        id: 'roadClosure',
        src: 'intentRoadClosure',
        explanation: [
            'At the start of your next turn, draw 2 fewer cards than normal.',
        ],
    },
    snowFort: {
        id: 'snowFort',
        src: 'intentSnowFort',
        explanation: ['All enemies recieve 100% block'],
    },
    commonCold: {
        id: 'commonCold',
        src: 'intentCommonCold',
        explanation: [
            'All targeted Kaiju receive <b>Fatigued</b> (1) and <b>Unguarded</b> (1).',
            'At the start of your next turn, draw 1 fewer card than normal.',
        ],
    },
    matchaMadness: {
        id: 'matchaMadness',
        explanation: [],
    },
    matchaMash: {
        id: 'matchaMash',
        explanation: [],
    },
    matchaMeld: {
        id: 'matchaMeld',
        explanation: [],
    },
    mimicAttack: {
        id: 'mimicAttack',
        src: 'intentMimic',
        explanation: [
            'Mimic attacks for the last amount of damage done to him.',
            'If Mimic is not attacked this turn, he will attack for 999 instead.',
        ],
    },
    parasiticNibble: {
        id: 'parasiticNibble',
        explanation: [],
    },
    passiveBlockCmd: {
        id: 'passiveBlockCmd',
        explanation: [],
    },
    psychicBolt: {
        id: 'psychicBolt',
        explanation: [],
    },
    quickNap: {
        id: 'quickNap',
        explanation: [],
    },
    rest: {
        id: 'rest',
        explanation: [],
    },
    rustyPokeHigh: {
        id: 'rustyPokeHigh',
        explanation: [],
    },
    rustyPokeLow: {
        id: 'rustyPokeLow',
        explanation: [],
    },
    slash: {
        id: 'slash',
        explanation: [],
    },
    snortinTime: {
        id: 'snortinTime',
        src: 'intentSnortinTime',
        explanation: ['Apply <b>Unguarded</b> (2) to all player Kaiju'],
    },
    spiritQuest: {
        id: 'spiritQuest',
        explanation: ['All enemies receive <b>Brave</b> (2)'],
    },
    strike: {
        id: 'strike',
        explanation: [],
    },
    surpriseAllergy: {
        id: 'surpriseAllergy',
        explanation: [],
    },
    swordWack: {
        id: 'swordWack',
        explanation: [],
    },
    tummySlam: {
        id: 'tummySlam',
        explanation: [],
    },
    violentSneeze: {
        id: 'violentSneeze',
        explanation: ['Applies <b>Vulnerable</b> (3)'],
    },
    yodel: {
        id: 'yodel',
        src: 'intentYodel',
        explanation: [
            'After this turn, the enemy party will gain <b>Emboldened</b> (2)',
        ],
    },

    //matcha
    'itchyOoze(3)': {
        id: 'itchyOoze(3)',
        explanation: ['Applies 3 <b>Poisoned</b>'],
    },
    'itchyOoze(4)': {
        id: 'itchyOoze(4)',
        explanation: ['Applies 4 <b>Poisoned</b>'],
    },
    'surpriseAllergy(2,1)': {
        id: 'surpriseAllergy(2,1)',
        explanation: [
            `Applies <b>Poisoned</b> (2) and <b>Fatigued</b> (1) if any damage goes unblocked`,
        ],
    },
    'surpriseAllergy(3,2)': {
        id: 'surpriseAllergy(3,2)',
        explanation: [
            'Applies <b>Poisoned</b> (3) and <b>Fatigued</b> (2) if any damage goes unblocked',
        ],
    },
    mimicInfectiousBite: {
        id: 'mimicInfectiousBite',
        src: 'intentInfectiousBite',
        explanation: [
            'Mimic attacks for 100%.',
            'Apply <b>Poisoned</b> equal to the amount of unblocked damage.',
        ],
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
                anchor: commandMeta?.src ? [0.1, 0.4] : 0.4,
                events,
            }),
            ...(amount
                ? [
                      Text({
                          text: `${amount}`,
                          anchor: commandMeta?.src ? [0.2, 0.5] : 0.5,
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
