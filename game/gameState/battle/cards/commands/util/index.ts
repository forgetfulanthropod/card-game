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

export type ExecuteArgs<T = VAngu[]> = {
    dslArgs: T
    command: Command
    targetUids: CharacterUid[]
    cardUid?: CardUid
    scene: BattleCursor
    calculatedStats: CalculatedCharacterStats
}

export function s(n: number) {
    return n > 1 ? 's' : ''
}

export interface ArgsOf {
    addBlock: [block: number]
    addEnergy: [energy: number]

    chain: any[]
    deal: [damage: number, times?: number]
    effect: [id: EffectId, increase: number, targetType?: 'friends' | 'enemies']
    ifFirstPlay: any[]
    momentary: []
    orb: [type: OrbType, count: number]
    text: [str: string]
}

type IdxOf<T extends any[]> = Exclude<keyof T, keyof any[]>
type Anguify<T extends any[]> = VAngu<T[number]>[] & {
    [Idx in IdxOf<T>]: VAngu<T[Idx]>
}
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
