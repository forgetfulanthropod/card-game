import { BattleCursor } from 'shared'
import { keys } from 'shared/code'
import {
    resetKnightAbilityCounter,
    updateWizardAbility,
} from './activateClassAbility'

export function resetClassPassives(scene: BattleCursor) {
    resetKnightAbilityCounter(scene)
    updateWizardAbility(scene)
}
