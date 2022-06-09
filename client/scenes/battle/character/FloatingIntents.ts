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

const INTENT_ICON_WIDTH = 44

export function FloatingIntents(cuid: CharacterUid): PixiContainer {
    const nextNpcCommandsCursor = getBattleScene().select('nextNpcCommands')

    return For(
        toDatum(getBattleScene(), ({ nextNpcCommands, allCharacters }) =>
            nextNpcCommands
                .filter(cmd => cmd.targetUids.includes(cuid))
                .map(cmd => ({ key: cmd.command.characterUid, ...cmd }))
        ),
        nextCmd => FloatingIntent(nextCmd, cuid),
        index => ({ x: index * INTENT_ICON_WIDTH })
    )
}

function FloatingIntent(
    nextCmd: NextCommand,
    cuid: CharacterUid
): DisplayObject {
    if (nextCmd == null) throw new Error("it's broken")

    let children = DamageIntended(nextCmd.outcome.damages[cuid])
    if (nextCmd.command.targetType === 'self')
        children = BlockIntended(
            nextCmd.outcome.blocks[nextCmd.command.characterUid]
        )

    const root = Container({
        events: {
            pointerover: interact,
            pointerdown: interact,
            pointerup: stopInteracting,
            pointerout: stopInteracting,
        },
        children,
    })

    return root

    function interact() {
        // highlight attacker & show arrow
        highlightIntentFrom.set(nextCmd.command.characterUid)
        root.filters = [glowFilter]
        // describe intent in a black box?
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
            anchor: 0.5,
        }),
        Text({
            text: `${amount}`,
            anchor: 0.5,
            style: {
                fill: 'black',
                strokeThickness: 5,
                stroke: 'white',
                fontFamily: 'monoFont',
            },
        }),
    ]
}

function BlockIntended(amount: number) {
    return [
        Sprite({
            scale: (INTENT_ICON_WIDTH * 2) / getTexture('blockIntent').width,
            src: 'blockIntent',
            anchor: 0.5,
        }),
        Text({
            text: `${amount}`,
            anchor: 0.5,
            style: {
                fill: 'black',
                strokeThickness: 5,
                stroke: 'white',
                fontFamily: 'monoFont',
            },
        }),
    ]
}
