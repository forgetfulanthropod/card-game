import type { RODatum } from 'datums'
import { datum, compose } from 'datums'
import type { CharacterUid, NextCommand } from 'shared'
import { vals } from 'shared/code'
import { HEALTH_BAR_WIDTH } from './HealthBar'
import { getBattleScene } from '@/data'
import { getStage, PixiText } from '@/elementsUtil'
import {
    getElByPath,
    Container,
    For,
    If,
    onDestroyed,
    portalize,
    Text,
    Sprite,
    getTexture,
    fontMap,
} from '@/elementsUtil'
import { highlightIntentFrom, toDatum } from '@/util'

export function NpcIntentArrow(uid: CharacterUid, isHovered: RODatum<boolean>) {
    const battle = getBattleScene()
    const nextCmd = toDatum(battle.select('nextNpcCommands'), cmds =>
        cmds.find(({ command }) => command.characterUid === uid)
    )

    const root = Container({
        onDestroy: [() => nextCmd?.destroy && nextCmd.destroy()],
    })

    portalize({
        from: root,
        content: IntentArrows(uid, nextCmd, isHovered),
        nextFrame: true,
        to: () => getStage().getChildByName('NpcIntentArrowContainer', true)!,
    })

    return root
}

function IntentText(
    commandDatum: RODatum<NextCommand | undefined> & { destroy: Callback }
) {
    const text = Text({
        text: '',
        style: {
            fontSize: 24,
            fill: 'white',
            fontFamily: fontMap['sansFont'],
        },
        anchor: 0.5,
    })
    onDestroyed(
        text,
        commandDatum.onChange(
            _ => (text.text = getIntentText(commandDatum)),
            true
        )
    )
    return text
}

function getIntentText(
    nextCmd: RODatum<NextCommand | undefined> & { destroy: Callback }
): string {
    const command = nextCmd.val
    if (command == null) return ''

    return `${command.command.name} -${vals(command.outcome.damages).join(
        ', '
    )}`
}

export function IntentArrows(
    uid: CharacterUid,
    nextCmd: RODatum<NextCommand | undefined> & { destroy: Callback },
    isHovered: RODatum<boolean>
) {
    const orig = bottomLeftCornerOf(uid)
    const targets = compose(([cmd]) => cmd?.targetUids ?? [], nextCmd)

    const hasIntentArrow = datum(false)

    return onDestroyed(
        If(
            hasIntentArrow,
            () => For(targets, key => IntentArrow(key)),
            undefined,
            { displayArgs: { name: 'intentArrows' } }
        ),
        orig.destroy,
        highlightIntentFrom.onChange(_uid => {
            hasIntentArrow.set(
                commandHasIntentArrow(nextCmd.val) && _uid === uid
            )
        }),
        nextCmd.onChange(cmd => {
            if (!commandHasIntentArrow(cmd)) hasIntentArrow.set(false)
            else hasIntentArrow.set(isHovered.val)
        }),
        isHovered.onChange(is => {
            if (is) hasIntentArrow.set(commandHasIntentArrow(nextCmd.val))
            else hasIntentArrow.set(false)
        })
    )

    function IntentArrow(uid: CharacterUid) {
        const dest = bottomRightCornerOf(uid)

        return onDestroyed(
            EnemyIntentArrow(orig, dest, IntentText(nextCmd)),
            dest.destroy
        )
    }
}

function commandHasIntentArrow(cmd: NextCommand | undefined) {
    return !['self', 'allFriends'].includes(cmd?.command.targetType ?? '')
}

function bottomLeftCornerOf(uid: CharacterUid) {
    return toDatum(
        getBattleScene().select('allCharacters').select(uid),
        cm => ({
            x: cm.screenX - 30,
            y: cm.screenY + 12,
        })
    )
}
function bottomRightCornerOf(uid: CharacterUid) {
    return toDatum(
        getBattleScene().select('allCharacters').select(uid),
        cm => ({
            x: cm.screenX + HEALTH_BAR_WIDTH * 1.1,
            y: cm.screenY,
        })
    )
}

/** Destroys the text el passed in */
function EnemyIntentArrow(
    origin: RODatum<Point>,
    destination: RODatum<Point>,
    textEl: PixiText
) {
    const root = Container({})
    return onDestroyed(
        root,
        destination.onChange(update),
        origin.onChange(update, true),
        () => !textEl.destroyed && textEl.destroy(true)
    )

    function update() {
        root.removeChildren()

        const xDistance = origin.val.x - destination.val.x
        const yDistance = origin.val.y - destination.val.y
        const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
        const rotation = Math.asin(yDistance / distance)
        textEl.x = (origin.val.x + destination.val.x) / 2
        textEl.y = (origin.val.y + destination.val.y) / 2
        textEl.rotation = rotation

        const src = getTexture('enemyIntentArrowTail')
        const scale = (1920 * 0.5) / src.width
        root.addChild(
            Sprite({
                src,
                scale,
                width: distance - 10,
                anchor: [1, 0.5],
                pivot: [1, 0.5],
                rotation,
                x: origin.val.x,
                y: origin.val.y,
                alpha: 1, // overlap issue with transparency
            }),
            Sprite({
                src: 'enemyIntentArrowHead',
                name: 'enemyIntentArrowHead',
                scale,
                anchor: [0, 0.5],
                pivot: [1, 0.5],
                rotation,
                x: destination.val.x,
                y: destination.val.y,
                alpha: 1, // overlap issue with transparency
            })
        )
    }
}
