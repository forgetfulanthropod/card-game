import type { CharacterUid, NextCommand, NpcCommandId } from 'shared'
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
import type {
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
    cuid: CharacterUid
): DisplayObject {
    if (nextCmd == null) throw new Error("it's broken")

    const children =
        nextCmd.command.targetType === 'self'
            ? BlockIntended(
                  nextCmd.outcome.blocks[nextCmd.command.characterUid]
              )
            : DamageIntended(nextCmd, cuid)

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

function DamageIntended(
    command: NextCommand,
    cuid: CharacterUid
): DisplayObject[] {
    const commandIdToMetaMap: Record<
        (NpcCommandId & KeyTerm) | NpcCommandId,
        { id: NpcCommandId; src: IntentAssetKey; explanation?: string[] }
    > = {
        ancientStrike: {
            id: 'ancientStrike',
            src: 'intentAttack',
        },
        basicAttack: {
            id: 'basicAttack',
            src: 'intentAttack',
        },
        bigBomb1: {
            id: 'bigBomb1',
            src: 'intentBigBomb1',
            explanation: [
                `Gnome Big Bomber is charging their Big Bomb.  They will attack for [strength * 3] next turn.`,
                `If Gnome Big Bomber loses 40% of their starting health, they gain +2 <b>Debilitated</b>`,
                `If they lose 75% or more health, they gain +2 <b>Stun</b>`,
            ],
        },
        bigBomb2: {
            id: 'bigBomb2',
            src: 'intentBigBomb2',
            explanation: [
                `Gnome Big Bomber has charged their Big Bomb.  They will attack for [strength * 3] this turn.`,
                `If Gnome Big Bomber loses 40% of their starting health, they gain Debilitated (2).`,
                `If they lose 75% or more health, they gain Stun (1).`,
            ],
        },
        block: {
            id: 'block',
            src: 'intentAttack',
        },
        bucketOfBangSnaps: {
            id: 'bucketOfBangSnaps',
            src: 'intentAttack',
        },
        chomp: {
            id: 'chomp',
            src: 'intentAttack',
        },
        demolitionCharge: {
            id: 'demolitionCharge',
            src: 'intentAttack',
        },
        evisceratingSweep: {
            id: 'evisceratingSweep',
            src: 'intentAttack',
        },
        fireCracker: {
            id: 'fireCracker',
            src: 'intentAttack',
        },
        gnomeBomb: {
            id: 'gnomeBomb',
            src: 'intentAttack',
            explanation: ['deal [strength * .3] to all friendly Kaiju'],
        },
        grudge: {
            id: 'grudge',
            src: 'intentGrudge',
        },
        hansBuffBlock: {
            id: 'hansBuffBlock',
            src: 'intentAttack',
        },
        hansCurse: {
            id: 'hansCurse',
            src: 'intentAttack',
        },
        hansGuards: {
            id: 'hansGuards',
            src: 'intentAttack',
        },
        hansMagicMissile: {
            id: 'hansMagicMissile',
            src: 'intentAttack',
        },
        itchyOozeSpecial: {
            id: 'itchyOozeSpecial',
            src: 'intentAttack',
        },
        jab: {
            id: 'jab',
            src: 'intentAttack',
        },
        jurgenBellyFlop: {
            id: 'jurgenBellyFlop',
            src: 'intentAttack',
        },
        jurgenRollAround: {
            id: 'jurgenRollAround',
            src: 'intentAttack',
        },
        jurgenSitUpon: {
            id: 'jurgenSitUpon',
            src: 'intentAttack',
        },
        jurgenStampSnort: {
            id: 'jurgenStampSnort',
            src: 'intentAttack',
        },
        matchaMadness: {
            id: 'matchaMadness',
            src: 'intentAttack',
        },
        matchaMash: {
            id: 'matchaMash',
            src: 'intentAttack',
        },
        matchaMeld: {
            id: 'matchaMeld',
            src: 'intentAttack',
        },
        mimicAttack: {
            id: 'mimicAttack',
            src: 'intentMimic',
            explanation: ['copies last hit this turn or deals 999'],
        },
        passiveBlockCmd: {
            id: 'passiveBlockCmd',
            src: 'intentAttack',
        },
        rest: {
            id: 'rest',
            src: 'intentAttack',
        },
        rustyPokeHigh: {
            id: 'rustyPokeHigh',
            src: 'intentAttack',
        },
        rustyPokeLow: {
            id: 'rustyPokeLow',
            src: 'intentAttack',
        },
        slash: {
            id: 'slash',
            src: 'intentAttack',
        },
        strike: {
            id: 'strike',
            src: 'intentAttack',
        },
        swordWack: {
            id: 'swordWack',
            src: 'intentAttack',
        },
        yodel: {
            id: 'yodel',
            src: 'intentAttack',
        },
    }

    //@ts-ignore
    const commandMeta = commandIdToMetaMap?.[command.command.id]

    const intentIconTexture = getTexture(commandMeta?.src ?? 'intentAttack')
    const amount =
        (command.outcome.damages?.[cuid] ?? 0) -
        (command.outcome.blocks?.[cuid] ?? 0)

    const isHoveringIntent = datum(false)
    const infoBox =
        commandMeta == null
            ? null
            : commandMeta.explanation
            ? ExplanationIf({
                  isShown: isHoveringIntent,
                  texts: [
                      startCase(commandMeta.id),
                      ...transformExplanation(commandMeta.explanation),
                  ],
                  xOffset: 50,
                  yOffset: 10,
              })
            : Object.hasOwn(keyTermsMap, commandMeta.id)
            ? TermExplanationIf({
                  isShown: isHoveringIntent,
                  term: commandMeta.id,
                  xOffset: 50,
                  yOffset: 10,
              })
            : ExplanationIf({
                  isShown: isHoveringIntent,
                  texts: [startCase(commandMeta.id)],
                  xOffset: 50,
                  yOffset: 10,
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

    return [
        Sprite({
            scale: INTENT_ICON_WIDTH / intentIconTexture.width,
            src: intentIconTexture,
            anchor: [0.4, 0.4],
            events,
        }),
        Text({
            text: `${amount}`,
            anchor: 0.5,
            events,
            style: {
                fill: 'white',
                strokeThickness: 5,
                stroke: 'black',
                fontFamily: 'sansFont',
                fontSize: 24,
            },
        }),
        ...(infoBox ? [infoBox] : []),
    ]
}

function transformExplanation(explanation: string) {
    // const statSlots = explanation.match(/[.+]/g)

    return explanation
}

function BlockIntended(amount: number) {
    return [
        Sprite({
            y: -190,
            x: -290,
            scale: INTENT_ICON_WIDTH / getTexture('intentBlock').width,
            src: 'intentBlock',
            anchor: [0.2, 0.2],
        }),
        Text({
            y: -190,
            x: -290,
            text: `${amount ?? '?'}`,
            anchor: 0.5,
            style: {
                fill: 'white',
                strokeThickness: 5,
                stroke: 0,
                fontFamily: 'sansFont',
            },
        }),
    ]
}
