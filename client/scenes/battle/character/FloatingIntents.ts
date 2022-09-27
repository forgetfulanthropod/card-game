import type { CharacterUid, CommandId, NextCommand } from 'shared'
import type { KeyTerm } from '../ExplanationBox'
import { TermExplanationBox } from '../ExplanationBox'
import { highlightIntentFrom, toDatum } from '@/util'
import type { AssetKey, DisplayObject, PixiContainer } from '@/elementsUtil'
import {
    glowFilter,
    Container,
    For,
    getTexture,
    Sprite,
    Text,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'

const INTENT_ICON_WIDTH = 66

export function FloatingIntents(cuid: CharacterUid): PixiContainer {
    return For(
        toDatum(getBattleScene().select('nextNpcCommands'), nextNpcCommands =>
            nextNpcCommands == null
                ? []
                : nextNpcCommands
                      .filter(cmd => cmd.targetUids.includes(cuid))
                      .map(cmd => ({ key: cmd.command.characterUid, ...cmd }))
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
        CommandId & KeyTerm,
        { id: CommandId; src: AssetKey }
    > = {
        mimicAttack: {
            id: 'mimicAttack',
            src: 'intentMimic',
        },
        infectiousBite: {
            id: 'infectiousBite',
            src: 'intentInfectiousBite',
        },
        grudge: {
            id: 'grudge',
            src: 'intentGrudge',
        },
    }

    //@ts-ignore
    const commandMeta = commandIdToMetaMap?.[command.command.id]

    const intentIconTexture = getTexture(commandMeta?.src ?? 'intentAttack')
    const amount = command.outcome.damages[cuid]

    const infoBox =
        commandMeta == null
            ? null
            : TermExplanationBox({
                  term: commandMeta.id,
                  displayObjectArgs: { x: 10, y: 10 },
              })

    return [
        Sprite({
            scale: INTENT_ICON_WIDTH / intentIconTexture.width,
            src: intentIconTexture,
            anchor: [0.4, 0.4],
        }),
        Text({
            text: `${amount != null ? amount : '?'}`,
            anchor: 0.5,
            style: {
                fill: 'white',
                strokeThickness: 5,
                stroke: 'black',
                fontFamily: 'sansFont',
                fontSize: 18,
            },
        }),
        ...(infoBox ? [infoBox] : []),
    ]
}

function BlockIntended(amount: number) {
    return [
        Sprite({
            x: 90,
            scale: INTENT_ICON_WIDTH / getTexture('intentBlock').width,
            src: 'intentBlock',
            anchor: [0.2, 0.2],
        }),
        Text({
            x: 90,
            text: `${amount}`,
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
