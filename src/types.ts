import Preact from 'preact'
// import Preact, {JSX} from 'preact'
import { StateUpdater } from 'preact/hooks'

// const o : {x: typeof JSX} = {x: Preact.JSX}
// type JSX = typeof Preact.JSX

declare global {
    // type JSX.Element = PJSX.Element
    type Children = Preact.JSX.Element | null | false | Children[]
    type Callback = () => void
    type Setter<T> = StateUpdater<T | undefined>
    type CharacterName =
        | 'Frogknight'
        | 'Penguin Knight'
        | 'Skeleton'
        | 'Matcha'
        | 'Notorious B.E.A.N'
        | 'Warhog'
        | 'Green Jester'
        | 'Penguin Knight'
        | 'Mimic'
        | 'Dragon'
        | 'Bloat Demon'
        | 'Orc Warrior'
        | 'Bookle'

    type CharacterMeta = {
        id: string
        type: CharacterName
        level: number
        damage: number
        moves: MoveMeta[]
        isPc: boolean
        hasMoved: boolean
        health: number
        maxHealth: number
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
    type MoveMeta = {
        type: MoveType
        name: string
        spriteUrl?: string
    }
    type MoveType = 'BA' | 'SL' | 'ROD1' | 'ROD2' | 'ROD3' | 'DOT1' | 'DOT2' | 'DOT3'
    type MoveTypeMeta = {
        id: MoveType
        numTargets: number
        multiplier: number
        defaultSpriteUrl?: string
    }
    type AttackData = {
        attacker: CharacterMeta
        defenders: CharacterMeta[]
        move: MoveMeta
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
