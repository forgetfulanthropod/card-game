import type { RODatum } from 'datums'
import { compose } from 'datums'
import type { CharacterUid, NextCommand } from 'shared'
import { vals } from 'shared/code'
import { HEALTH_BAR_WIDTH } from './HealthBar'
import { getBattleScene } from '@/data'
import {
    getElByPath,
    Container,
    For,
    If,
    onDestroyed,
    portalize,
    Text,
    Sprite,
} from '@/elementsUtil'
import { toDatum } from '@/util'

export function ActionIntent(uid: CharacterUid, isHovered: RODatum<boolean>) {
    const battle = getBattleScene()
    const nextCmd = toDatum(battle.select('nextNpcCommands'), cmds =>
        cmds.find(({ command }) => command.characterUid === uid)
    )

    const text = Text({
        text: '',
        style: {
            fontSize: 34,
            fill: 'white',
            fontFamily: 'sansFont',
            // stroke: 'white',
            // strokeThickness: 4,
        },
        anchor: [1.1, 1.7],
    })
    onDestroyed(
        text,
        isHovered.onChange(is => {
            if (!is) text.text = ''
            else text.text = getIntentText(nextCmd)
        }),
        nextCmd.onChange(
            c => (text.text = isHovered.val ? c?.command?.name ?? '' : ''),
            true
        )
    )
    const arrows = IntentArrows(uid, nextCmd, isHovered)
    const root = Container({
        children: [text],
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

function getIntentText(
    nextCmd: RODatum<NextCommand | undefined> & { destroy: Callback }
): string {
    const command = nextCmd.val
    if (command == null) return ''

    return `${command.command.name} (${vals(command.outcome.damages).join(
        ', '
    )})`
}

function IntentArrows(
    uid: CharacterUid,
    nextCmd: RODatum<NextCommand | undefined> & { destroy: Callback },
    isHovered: RODatum<boolean>
) {
    const orig = bottomLeftCornerOf(uid)
    const targets = compose(([cmd]) => cmd?.targetUids ?? [], nextCmd)

    return onDestroyed(
        If(isHovered, () => For(targets, key => IntentArrow(key)), undefined, {
            name: 'intentArrows',
        }),
        orig.destroy
    )

    function IntentArrow(uid: CharacterUid) {
        const dest = bottomRightCornerOf(uid)
        return onDestroyed(EnemyIntentArrow(orig, dest), dest.destroy)
    }
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
            x: cm.screenX + HEALTH_BAR_WIDTH,
            y: cm.screenY,
        })
    )
}

function EnemyIntentArrow(origin: RODatum<Point>, destination: RODatum<Point>) {
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

        root.addChild(
            Sprite({
                src: 'enemyIntentArrow',
                width: distance,
                anchor: [1, 0.5],
                pivot: [1, 0.5],
                rotation: Math.asin(yDistance / distance),
                x: origin.val.x,
                y: origin.val.y,
            })
        )
    }
}
