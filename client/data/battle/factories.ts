import { SceneName } from '../types'
import { BASE_HEIGHT, BASE_WIDTH, CharacterMove, statsMap, X_AGGRESSIVE_THRESH, X_NEUTRAL_THRESH } from './constants'
import { getId } from './misc'

export function makeInitialCharacters(): CharacterMeta[] {
    const nonPlayerCharacterPositions = makePositions(65, 50, 18, 13, 6)
    const playerCharacterPositions = makePositions(10, 50, 18, 13, 6)
    return [
        ...nonPlayerCharacterPositions.map(([x, y]) => newNPCMeta({ x, y })),
        ...playerCharacterPositions.map(([x, y]) => newPCMeta({ x, y })),
    ]
}

export interface BattleState {
    type: SceneName
    state: 'in battle' | 'won' | 'lost'
    isPlayerTurn: boolean
    battleHasBegun: boolean
    allCharacters: CharacterMeta[]
    selectedCharacter: CharacterMeta
    selectedMove: CharacterMove
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
}
export function makeInitialState(
    // TODO
    // chosenCharacters: CharacterName[]
): BattleState {
    const allCharacters = makeInitialCharacters()

    // kill most of the characters
    // for (let i = 0; i < 12; i++) {
    //     if (i === 0 || i === 6) continue
    //     allCharacters[i].health = -1
    //     // allCharacters
    // }


    const selectedCharacter = allCharacters.find(c => c.isPc)
    if (!selectedCharacter) {
        throw Error('could not find any initial player characters')
    }
    const selectedMove = selectedCharacter.moves[0]
    if (selectedCharacter == null) throw Error('no player characters!')
    return Object.freeze({
        type: 'battle',
        state: 'in battle',
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
function newPCMeta(args: { x: number; y: number }): CharacterMeta {
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    const stance: StanceType = args.x > X_AGGRESSIVE_THRESH ?
        'aggressive' :
        (args.x > X_NEUTRAL_THRESH ? 'neutral' : 'defensive')
    return {
        ...statsMap.frogKnight,
        id: getId(args.x, args.y),
        isPc: true,
        x: args.x,
        y: args.y,
        screenX: scale * BASE_WIDTH * args.x / 100,
        screenY: scale * BASE_HEIGHT * args.y / 100,
        stance,
        hasMoved: false,
        health: statsMap.frogKnight.maxHealth,
    }
}
function newNPCMeta(args: { x: number; y: number }): CharacterMeta {
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    return {
        ...statsMap.skeletonWarrior,
        id: getId(args.x, args.y),
        isPc: false,
        x: args.x,
        y: args.y,
        screenX: scale * BASE_WIDTH * args.x / 100,
        screenY: scale * BASE_HEIGHT * args.y / 100,
        stance: 'neutral',
        hasMoved: false,
        health: statsMap.skeletonWarrior.maxHealth,
    }
}
