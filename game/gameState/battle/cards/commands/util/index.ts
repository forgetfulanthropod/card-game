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
} from 'shared'

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
    addWisdom: [block: number]
    addStrength: [block: number]
    addEnergy: [energy: number]

    choice: any[]
    chain: any[]
    deal: [damage: number, times?: number]
    effect: [id: EffectId, increase: number, targetType?: 'friends' | 'enemies']
    ifFirstPlay: any[]
    momentary: []
    orb: [type: OrbType, count: number]
    text: [str: string]
    ifDamageDealt: [mainMove: any, conditionalMove: any]
    ifTargetDies: [mainMove: any, conditionalMove: any]
    queue: [numTurns: number, move: any]

    killIf: [condition: boolean]
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

export function evalOne(angu: VAngu) {
    return angu.eval()
}

export function evalAll<T extends any[]>(angus: Anguify<T>): T {
    // @ts-expect-error
    return angus.map(angu => angu.eval())
}

// remaining verbs: doubleEnchantmentOrToken
// weird choice / target type: arcanePower prayerOfGoodFortune

// Verbs enemies need: mimicAttack dot ifDamageDealt damageTaken rest matchaMeld summon
