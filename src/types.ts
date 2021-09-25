declare global {
    type Children = JSX.Element[] | JSX.Element
    type Callback = () => void
    type Setter<T> = React.Dispatch<React.SetStateAction<T>>
    type CharacterMeta = {
        id: string
        type: 'Frogknight' | 'Penguin Knight' | 'Skeleton' | 'Matcha'
        level: number
        damage: number
        moves: MoveMeta[]
        isPc: boolean
        hasMoved: boolean
        health: number
        maxHealth: number
        x: number
        y: number
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
}

export default null
