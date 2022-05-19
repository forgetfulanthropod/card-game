import type { CharacterName, SpecialDoorName } from '..'
import type { Brandify, TargetType } from './misc'

export type Blessing = Readonly<{
    name: string
    displayName?: string
    after?: {
        doorType?: SpecialDoorName
    }
    effects: {
        target: TargetType | { type: TargetType; characterType: CharacterName }
        healthMultiplicand?: number
        healthAddend?: number
        damageMultiplicand?: number
        damageAddend?: number
    }[]
}> &
    Brandify
export type BlessingName =
    | 'ptbotflax'
    | 'strongPcs'
    | 'strongEnemies'
    | 'weakEnemies'
    | 'weakPcs'
