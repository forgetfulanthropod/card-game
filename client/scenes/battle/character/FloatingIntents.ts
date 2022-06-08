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
        toDatum(nextNpcCommandsCursor, all => {
            return all
                .filter(cmd => cmd.targetUids.includes(cuid))
                .map(cmd => cmd.command.characterUid)
        }),
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

        const textEl = Text({
            text: nextCmd.outcome.damages[cuid],
            anchor: 0.5,
            style: {
                fill: 'black',
                strokeThickness: 5,
                stroke: 'white',
                fontFamily: 'monoFont',
            },
        })

        const root = Container({
            events: {
                pointerover: interact,
                pointerdown: interact,
                pointerup: stopInteracting,
                pointerout: stopInteracting,
            },
            x: index * 44,
            children: [
                Sprite({
                    scale: 46 / getTexture('floatingIntentAmount').width,
                    src: 'floatingIntentAmount',
                    anchor: 0.5,
                }),
                textEl,
            ],
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
