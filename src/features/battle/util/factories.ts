import { X_AGGRESSIVE_THRESH, X_NEUTRAL_THRESH } from '../components/AllCharacters'
import { getId } from './misc'

export function makeInitialPlayerCharacters(): CharacterMeta[] {
    const skeletonPositions = makePositions(65, 22, 18, 15)
    const frogknightPositions = makePositions(10, 25, 18, 15)
    const result = [
        ...skeletonPositions.map(([x, y]) => newSkeletonMeta({ x, y })),
        ...frogknightPositions.map(([x, y]) => newFrogknightMeta({ x, y })),
    ]
    return result
}
function makePositions(x0: number, y0: number, hGap: number, vGap: number, n = 6): [number, number][] {
    const A: [number, number][] = [
        [x0, y0],
        [x0 + hGap, y0],
        [x0 - hGap / 2, y0 + vGap],
        [x0 + hGap / 2, y0 + vGap],
        [x0, y0 + vGap * 2],
        [x0 + hGap, y0 + vGap * 2],
    ]
    return A.slice(0, n)
}
function newFrogknightMeta(args: { x: number; y: number }): CharacterMeta {
    const stance: StanceType = args.x > X_AGGRESSIVE_THRESH ?
        'aggressive' :
        (args.x > X_NEUTRAL_THRESH ? 'neutral' : 'defensive')
    return {
        id: getId(args.x, args.y),
        type: 'Frogknight',
        level: 1,
        damage: 10,
        isPlayerCharacter: true,
        x: args.x,
        y: args.y,
        stance,
        hasMoved: false,
        health: 72,
        moves: [
            {
                name: 'Dutiful Stab',
                type: 'BA',
            },
            {
                name: 'Slash',
                type: 'SL',
            },
            {
                name: 'Slash',
                type: 'SL',
            },
        ]
    }
}
function newSkeletonMeta(args: { x: number; y: number }): CharacterMeta {
    return {
        id: getId(args.x, args.y),
        type: 'Skeleton',
        level: 1,
        damage: 8,
        isPlayerCharacter: false,
        x: args.x,
        y: args.y,
        stance: 'neutral',
        hasMoved: false,
        health: 10,
        moves: [
            {
                name: 'Sword Whack',
                type: 'BA',
            },
            {
                name: 'Rusty Poke',
                type: 'DOT2',
            },
            {
                name: 'Slash',
                type: 'SL',
            },
        ]
    }
}
