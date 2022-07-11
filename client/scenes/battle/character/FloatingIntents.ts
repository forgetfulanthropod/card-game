import type { CharacterUid, NextCommand } from 'shared'
import { highlightIntentFrom, toDatum } from '@/util'
import type { DisplayObject, PixiContainer } from '@/elementsUtil'
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
            : DamageIntended(nextCmd.outcome.damages[cuid])

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

function DamageIntended(amount: number) {
    return [
        Sprite({
            scale: INTENT_ICON_WIDTH / getTexture('floatingIntentAmount').width,
            src: 'floatingIntentAmount',
            anchor: [0.4, 0.4],
        }),
        Text({
            text: `${amount}`,
            anchor: 0.5,
            style: {
                fill: 'white',
                strokeThickness: 5,
                stroke: 'black',
                fontFamily: 'sansFont',
            },
        }),
    ]
}

function BlockIntended(amount: number) {
    return [
        Sprite({
            x: 90,
            scale: INTENT_ICON_WIDTH / getTexture('blockIntent').width,
            src: 'blockIntent',
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
