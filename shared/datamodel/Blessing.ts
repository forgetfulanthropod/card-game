import type { BlessingName, CharacterName, SpecialDoorName } from '../index'
import type { Brandify, TargetType } from './misc'

export type Blessing = Readonly<{
    name: BlessingName
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
