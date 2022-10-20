import { BattleCursor } from 'shared'
import { getLivingNpcs } from '@/gameState'
import { removeDeadCharacterCards } from './removeDeadCharacterCards'

export function clearDead(scene: BattleCursor) {
    removeDeadCharacterCards(scene)
    clearDeadCommands(scene)
}
function clearDeadCommands(scene: BattleCursor) {
    const livingNpcUids = getLivingNpcs(scene.get()).map(npc => npc.uid)
    if (scene.get('nextNpcCommands').length !== livingNpcUids.length) {
        scene.apply('nextNpcCommands', nextCommands =>
            nextCommands.filter(cmd =>
                livingNpcUids.includes(cmd.command.characterUid)
            )
        )
    }
}
function _clearDeadCharacters(_scene: BattleCursor) {
    throw new Error('Function not implemented.')
}
