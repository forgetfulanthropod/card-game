import { CharacterUid, StanceName } from '@/data/types'
import { getId } from '../../client/data/battle/misc'
import { BASE_HEIGHT, BASE_WIDTH, statsMap, X_AGGRESSIVE_THRESH, X_NEUTRAL_THRESH } from './constants'
import { BattleScene, CharacterMeta } from './types'

export const initialCharacters = (function makeInitialCharacters(): Record<CharacterUid, CharacterMeta> {
    const nonPlayerCharacterPositions = makePositions(65, 50, 18, 13, 6)
    const playerCharacterPositions = makePositions(10, 50, 18, 13, 6)
    const all = [
        ...nonPlayerCharacterPositions.map(([x, y]) => newNPCMeta({ x, y })),
        ...playerCharacterPositions.map(([x, y]) => newPCMeta({ x, y })),
    ]
    const o: Record<CharacterUid, CharacterMeta> = {}
    for (const c of all) {
        o[Math.random().toString().slice(2)] = c
    }
    return o
})()

export const initialBattleState: BattleScene = (function makeInitialState(
    // TODO
    // chosenCharacters: CharacterName[]
): BattleScene {
    const allCharacters = initialCharacters

    // kill most of the characters
    // for (let i = 0; i < 12; i++) {
    //     if (i === 0 || i === 6) continue
    //     allCharacters[i].health = -1
    //     // allCharacters
    // }


    const selectedCharacter = Object.values(allCharacters).find(c => c.isPc)
    if (!selectedCharacter) {
        throw Error('could not find any initial player characters')
    }
    const selectedMove = selectedCharacter.moves[0].name
    if (selectedCharacter == null) throw Error('no player characters!')
    return Object.freeze({
        name: 'battle',
        turnCount: 0,
        state: 'in battle',
        isPlayerTurn: Math.random() < .5,
        battleHasBegun: true,
        allCharacters,
        selectedCharacter: selectedCharacter.uid,
        selectedMove,
        isBasicLoaded: false,
        isDeluxeLoaded: false,
    })
})()

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
    const stance: StanceName = args.x > X_AGGRESSIVE_THRESH ?
        'aggressive' :
        (args.x > X_NEUTRAL_THRESH ? 'neutral' : 'defensive')
    return {
        ...statsMap.frogKnight,
        name: statsMap.frogKnight.type,
        uid: getId(args.x, args.y),
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
        name: statsMap.frogKnight.type,
        uid: getId(args.x, args.y),
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
