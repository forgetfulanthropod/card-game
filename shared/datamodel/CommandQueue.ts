/** Commands which will be executed in future rounds */
import type { CharacterUid, Command } from '@'

export type QueuedCommand = {
    description?: string
    command: Command
    targetUids: CharacterUid[]
    turnsAway: number
    /** Technically redundant with command.characterUid lookup but very convenient */
    side: 'pc' | 'npc'
}

export type CommandQueue = QueuedCommand[]
