import { random } from 'lodash'
import type {
    BattleCursor,
    CharacterUid,
    CommandId,
    CommandQueue,
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
    const nextQ: CommandQueue = []
    for (const qc of scene.get('queue')) {
        if (qc.side === starting) {
            const turnsAway = qc.turnsAway - 1
            if (turnsAway <= 0) {
                const { command, targetUids } = qc
                interpretCommand({ command, scene, targetUids })
                if (turnsAway < 0) nextQ.push({ ...qc, turnsAway })
            } else {
                nextQ.push({ ...qc, turnsAway })
            }
        } else {
            nextQ.push(qc)
        }
    }

    scene.set('queue', nextQ)
}
