/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Value as VAngu } from 'angu'

import type {
    Command,
    CharacterUid,
    BattleCursor,
    CalculatedCharacterStats,
    CardUid,
    EffectId,
    OrbType,
    RequiredActionName,
    BasicTargetType,
} from 'shared'

export type { Value as VAngu } from 'angu'

type ExecuteArgs<T = VAngu[]> = {
    dslArgs: T
    command: Command
    targetUids: CharacterUid[]
    cardUid?: CardUid
    scene: BattleCursor
    calculatedStats: Locals
}

export function s(n: number) {
    return n > 1 ? 's' : ''
}

interface ArgsOf {
    addBlock: [block: number]
    addBlockToSelf: [block: number]
    addWisdom: [block: number]
    addStrength: [block: number]
    addEnergy: [energy: number]
    addEnergyPerRound: [energy: number]

    choice: any[]
    chain: any[]
    deal: [damage: number, times?: number]
    dwindle: []
    effect: [id: EffectId, increase: number, targetType?: BasicTargetType]
    ifFirstPlay: any[]
    momentary: []
    orb: [type: OrbType, count: number]
    text: [str: string]
    ifDamageDealt: [mainMove: any, conditionalMove: any]
    smite: [damage: number, block: number]
    queue: [numTurns: number, move: any]

    killIf: [condition: boolean]

    draw: [numCards: number]
    discard: [numCards: number]
    orbOfHolyLight: []
    psychicWarfare: [damage: number, sameTargetAddend: number]
    doubleEnchantmentOrToken: []
    require: [type: RequiredActionName, least: number, most: number]
}

export type Locals = CalculatedCharacterStats & {
    /** only defined when there is exactly 1 target and it is a character */
    targetHealth: number | undefined
}

export type Anguify<T extends any[]> = { [K in keyof T]: VAngu<T[K]> }

export type Executors = {
    [K in keyof ArgsOf]: (args: ExecuteArgs<Anguify<ArgsOf[K]>>) => void
}
export type Explainers = {
    [K in keyof ArgsOf]: (dslArgs: Anguify<ArgsOf[K]>) => string
}

export function evalAll<T extends any[]>(angus: Anguify<T>): T {
    // @ts-expect-error
    return angus.map(angu => angu.eval())
}

// remaining verbs: doubleEnchantmentOrToken
// weird choice / target type: arcanePower prayerOfGoodFortune

// Verbs enemies need: mimicAttack dot ifDamageDealt damageTaken rest matchaMeld summon
