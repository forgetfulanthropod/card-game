import type { RODatum } from 'datums'
import { datum, compose } from 'datums'
import type { CharacterUid, NextCommand } from 'shared'
import { vals } from 'shared/code'
import { HEALTH_BAR_WIDTH } from './HealthBar'
import { getBattleScene } from '@/data'
import type { PixiText } from '@/elementsUtil'
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
} from '@/elementsUtil'
import { toDatum } from '@/util'

export function ActionIntent(uid: CharacterUid, isHovered: RODatum<boolean>) {
    const battle = getBattleScene()
    const nextCmd = toDatum(battle.select('nextNpcCommands'), cmds =>
        cmds.find(({ command }) => command.characterUid === uid)
    )

    const arrows = IntentArrows(uid, nextCmd, isHovered)
    const root = Container({
        children: [],
        onDestroy: [nextCmd.destroy],
    })
    const intentArrowsContainer = () =>
        getElByPath({ path: ['BattleScene', 'IntentArrowsContainer'] })
    portalize({
        from: root,
        content: arrows,
        nextFrame: true,
        to: intentArrowsContainer,
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
            fontFamily: 'sansFont',
        },
        anchor: 0.5,
    })
    onDestroyed(
        text,
        commandDatum.onChange(
            c => (text.text = getIntentText(commandDatum)),
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

function IntentArrows(
    uid: CharacterUid,
    nextCmd: RODatum<NextCommand | undefined> & { destroy: Callback },
    isHovered: RODatum<boolean>
) {
    const orig = bottomLeftCornerOf(uid)
    const targets = compose(([cmd]) => cmd?.targetUids ?? [], nextCmd)

    if (nextCmd.val?.command.targetType === 'self') return null
    const hasIntentArrow = datum(false)

    return onDestroyed(
        If(
            hasIntentArrow,
            () => For(targets, key => IntentArrow(key)),
            undefined,
            {
                name: 'intentArrows',
            }
        ),
        orig.destroy,
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
    return cmd?.command.targetType !== 'self'
}

function bottomLeftCornerOf(uid: CharacterUid) {
    return toDatum(
        getBattleScene().select('allCharacters').select(uid),
        cm => ({
            x: cm.screenX,
            y: cm.screenY,
        })
    )
}
function bottomRightCornerOf(uid: CharacterUid) {
    return toDatum(
        getBattleScene().select('allCharacters').select(uid),
        cm => ({
            x: cm.screenX + HEALTH_BAR_WIDTH * 0.75,
            y: cm.screenY,
        })
    )
}

function EnemyIntentArrow(
    origin: RODatum<Point>,
    destination: RODatum<Point>,
    text: PixiText
) {
    const root = Container({
        children: [],
    })
    return onDestroyed(
        root,
        destination.onChange(update),
        origin.onChange(update, true)
    )

    function update() {
        root.removeChildren()

        const xDistance = origin.val.x - destination.val.x
        const yDistance = origin.val.y - destination.val.y
        const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
        const rotation = Math.asin(yDistance / distance)
        text.x = (origin.val.x + destination.val.x) / 2
        text.y = (origin.val.y + destination.val.y) / 2
        text.rotation = rotation

        const src = getTexture('enemyIntentArrow')
        root.addChild(
            Sprite({
                src,
                scale: (1920 * 0.5) / src.width,
                width: distance,
                anchor: [1, 0.5],
                pivot: [1, 0.5],
                rotation,
                x: origin.val.x,
                y: origin.val.y,
            }),
            text
        )
    }
}
