import { BASE_HEIGHT, BASE_WIDTH, X_AGGRESSIVE_THRESH, X_NEUTRAL_THRESH } from './constants'
import { getId } from './misc'

export function makeInitialPlayerCharacters(): CharacterMeta[] {
    const skeletonPositions = makePositions(65, 50, 18, 13, 1)
    const frogknightPositions = makePositions(10, 50, 18, 13, 6)
    const result = [
        ...skeletonPositions.map(([x, y]) => newSkeletonMeta({ x, y })),
        ...frogknightPositions.map(([x, y]) => newFrogknightMeta({ x, y })),
    ]
    return result
}

export interface BattleState {
    type: 'battle'
    isPlayerTurn: boolean
    battleHasBegun: boolean
    allCharacters: CharacterMeta[]
    selectedCharacter: CharacterMeta
    selectedMove: MoveMeta | undefined
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
}
export function makeInitialState(): BattleState {
    const allCharacters = makeInitialPlayerCharacters()
    const selectedCharacter = allCharacters.find(c => c.isPc)
    const selectedMove = selectedCharacter?.moves[0]
    if (selectedCharacter == null) throw Error('no player characters!')
    return Object.freeze({
        type: 'battle', // TODO: type is not used yet...
        isPlayerTurn: Math.random() < .5,
        battleHasBegun: true,
        allCharacters,
        selectedCharacter,
        selectedMove,
        isBasicLoaded: false,
        isDeluxeLoaded: false,
    })
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
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    const stance: StanceType = args.x > X_AGGRESSIVE_THRESH ?
        'aggressive' :
        (args.x > X_NEUTRAL_THRESH ? 'neutral' : 'defensive')
    return {
        id: getId(args.x, args.y),
        type: 'Frogknight',
        level: 1,
        damage: 4,
        isPc: true,
        x: args.x,
        y: args.y,
        screenX: scale * BASE_WIDTH * args.x / 100,
        screenY: scale * BASE_HEIGHT * args.y / 100,
        stance,
        hasMoved: false,
        health: 72,
        maxHealth: 72,
        moves: [
            {
                name: 'Dutiful Stab',
                type: 'BA',
            },
            {
                name: 'Slash',
                type: 'SL',
            },
        ]
    }
}
function newSkeletonMeta(args: { x: number; y: number }): CharacterMeta {
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    console.log('skeleton x y', {
        x: args.x,
        y: args.y,
    })
    return {
        id: getId(args.x, args.y),
        type: 'Skeleton',
        level: 1,
        damage: 3,
        isPc: false,
        x: args.x,
        y: args.y,
        screenX: scale * BASE_WIDTH * args.x / 100,
        screenY: scale * BASE_HEIGHT * args.y / 100,
        stance: 'neutral',
        hasMoved: false,
        health: 10,
        maxHealth: 10,
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
