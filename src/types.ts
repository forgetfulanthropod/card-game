import { CharacterMove as CharacterMove_, CharacterStats as CharacterStats_, MoveMeta as MoveMeta_ } from 'data/battle/constants'
import Preact from 'preact'
// import Preact, {JSX} from 'preact'
import { StateUpdater } from 'preact/hooks'


// const o : {x: typeof JSX} = {x: Preact.JSX}
// type JSX = typeof Preact.JSX

declare global {
    // type JSX.Element = PJSX.Element
    type MoveMeta = MoveMeta_
    type Children = Preact.JSX.Element | null | false | Children[]
    type Callback = () => void
    type Setter<T> = StateUpdater<T | undefined>
    type CharacterStats = CharacterStats_
    type CharacterMove = CharacterMove_
    interface CharacterMeta extends CharacterStats {
        id: string
        isPc: boolean
        hasMoved: boolean
        health: number
        x: number
        y: number
        screenX: number
        screenY: number
        stance: StanceType
    }
    type StanceType = 'defensive' | 'neutral' | 'aggressive'
    type StanceMultiplier = .75 | 1 | 1.25
    type StanceTypeMeta = {
        id: StanceType
        attackMultiplier: StanceMultiplier
        defenseMultiplier: StanceMultiplier
        targetLikelihood: 0 | 1 | 2
    }
    type MoveType = 'BA' | 'SL' | 'SP' | 'ROD1' | 'ROD2' | 'ROD3' | 'DOT1' | 'DOT2' | 'DOT3' | 'ST' | 'INHSO' | 'DC4A' | 'MIM'
    type MoveTypeMeta = {
        id: MoveType
        numTargets: number
        multiplier: number
        defaultSpriteUrl?: string
    }
    type AttackData = {
        attacker: CharacterMeta
        defenders: CharacterMeta[]
        move: CharacterMove
    }
    type Size = {
        width: number
        height: number
    }
    type SizeQ = {
        width?: number
        height?: number
    }
    type EmptyObject = Record<string, never>
}

export default null
