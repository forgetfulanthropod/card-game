import { random } from 'lodash'
import type {
    BattleCursor,
    CharacterUid,
    CommandId,
    DSLString,
    QueuedCommand,
    TargetType,
} from 'shared'
import { interpretCommand } from './cards'

export function enqueueCommand(qc: QueuedCommand, scene: BattleCursor): void {
    scene.select('queue').apply(q => [...q, qc])
}

export function enqueueAction(
    args: {
        description?: string
        actions: DSLString
        /** owner of card/command */
        characterUid: CharacterUid
        targetUids: CharacterUid[]
        turnsAway: number
        side: 'pc' | 'npc'
        targetType?: TargetType
        id?: CommandId
    },
    scene: BattleCursor
): void {
    const { targetType = 'enemies' } = args
    const { id = `generated-command-${random(1e5, 1e6)}` } = args
    const command: QueuedCommand = {
        description: args.description,
        command: {
            id,
            name: id,
            targetNum: args.targetUids.length,
            targetType,
            actions: args.actions,
            characterUid: args.characterUid,
        },
        targetUids: args.targetUids,
        turnsAway: args.turnsAway,
        side: args.side,
    }
    enqueueCommand(command, scene)
}

export function popAndRunQueue(
    scene: BattleCursor,
    starting: 'pc' | 'npc'
): void {
    scene.select('queue').apply(q => {
        const now = q.filter(c => c.side === starting && c.turnsAway <= 0)
        for (const { command, targetUids } of now) {
            interpretCommand({ command, scene, targetUids })
        }
        return q
            .filter(c => c.turnsAway > 0)
            .map(c =>
                c.side === 'pc' ? { ...c, turnsAway: c.turnsAway - 1 } : c
            )
        // return result
    })
}
