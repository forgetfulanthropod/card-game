import type { RODatum } from 'datums'
import { compose } from 'datums'
import type { CharacterUid, NextCommand } from 'shared'
import { getBattleScene } from '@/data'
import {
    Arrow,
    Container,
    For,
    If,
    onDestroyed,
    portalize,
    Text,
} from '@/elementsUtil'
import { toDatum } from '@/util'

export function ActionIntent(uid: CharacterUid, isHovered: RODatum<boolean>) {
    const battle = getBattleScene()
    const nextCmd = toDatum(battle.select('nextNpcCommands'), cmds =>
        cmds.find(({ command }) => command.characterUid === uid)
    )

    const text = Text({
        text: '',
        style: { fontSize: 20, fill: 'red' },
    })
    onDestroyed(
        text,
        nextCmd.onChange(c => (text.text = c?.command?.name ?? ''), true)
    )
    const arrows = IntentArrows(uid, nextCmd, isHovered)
    const root = Container({
        children: [text],
        onDestroy: [nextCmd.destroy],
    })
    portalize({ from: root, content: arrows, nextFrame: true })

    return root
}
function IntentArrows(
    uid: CharacterUid,
    nextCmd: RODatum<NextCommand | undefined> & { destroy: Callback },
    isHovered: RODatum<boolean>
) {
    const allCharacters = getBattleScene().select('allCharacters')
    const locationOf = (uid: CharacterUid) =>
        toDatum(allCharacters.select(uid), cm => ({
            x: cm.screenX,
            y: cm.screenY,
        }))

    const orig = locationOf(uid)
    const targets = compose(([cmd]) => cmd?.targetUids ?? [], nextCmd)

    return onDestroyed(
        If(isHovered, () => For(targets, key => IntentArrow(key))),
        orig.destroy
    )

    function IntentArrow(uid: CharacterUid) {
        const dest = locationOf(uid)
        return onDestroyed(Arrow(orig, dest), dest.destroy)
    }
}
