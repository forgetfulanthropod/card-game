import type { BattleCursor, Pile, Piles } from 'shared'
import { keys } from 'shared/code'
import { cardDefinitionsMap } from '@/rulebook'
import { resetClassPassives } from './resetClassPassives'
import { setAllCharactersToUnmoved } from './setAllCharactersToUnmoved'
import { clearAllEffects } from './effects'
import { clearCharacterStatModifiers } from './clearCharacterStatModifiers'

export function clearCharacterModifiersForRoom(scene: BattleCursor): void {
    resetClassPassives(scene)
    setAllCharactersToUnmoved(scene)
    clearAllEffects(scene)
    clearCharacterStatModifiers(scene, 'room')
    clearCharacterStatModifiers(scene, 'turn')
}
