import type { CharacterUid, NextCommand } from 'shared'
import type { ROCursor } from 'sbaobab'
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

export function FloatingIntents(cuid: CharacterUid): PixiContainer {
    const nextNpcCommandsCursor = getBattleScene().select('nextNpcCommands')

    return For(
        toDatum(getBattleScene(), ({ nextNpcCommands, allCharacters }) =>
            nextNpcCommands
                .filter(
                    cmd =>
                        cmd.targetUids.includes(cuid) &&
                        allCharacters[cmd.command.characterUid].health > 0
                )
                .map(cmd => cmd.command.characterUid)
        ),
        FloatingIntent(nextNpcCommandsCursor, cuid)
    )
}

function FloatingIntent(
    nextNpcCommandsCursor: ROCursor<NextCommand[]>,
    cuid: CharacterUid
): (item: CharacterUid, index: number) => DisplayObject {
    return (intenderUid, index) => {
        const nextCmd = nextNpcCommandsCursor
            .get()
            .find(cmd => cmd.command.characterUid === intenderUid)
        if (nextCmd == null) throw new Error("shit it's broken")

        let children = DamageIntended(nextCmd.outcome.damages[cuid])
        if (nextCmd.command.targetType === 'self')
            children = BlockIntended(nextCmd.outcome.blocks[intenderUid])

        const root = Container({
            events: {
                pointerover: interact,
                pointerdown: interact,
                pointerup: stopInteracting,
                pointerout: stopInteracting,
            },
            x: index * 44,
            children,
        })

        return root

        function interact() {
            // highlight attacker & show arrow
            highlightIntentFrom.set(intenderUid)
            root.filters = [glowFilter]
            // describe intent in a black box?
        }

        function stopInteracting() {
            highlightIntentFrom.set(null)
            root.filters = []
        }
    }
}

function DamageIntended(amount: number) {
    return [
        Sprite({
            scale: 46 / getTexture('floatingIntentAmount').width,
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
            scale: 86 / getTexture('blockIntent').width,
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
