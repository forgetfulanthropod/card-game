import type { BattleScene, CharacterMeta, CharacterName, CharacterUid, StanceName } from '@shared/index'

import { statsMap } from '.'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080
const X_AGGRESSIVE_THRESH = 11
const X_NEUTRAL_THRESH = 9

export const numbers = { BASE_WIDTH, BASE_HEIGHT, X_AGGRESSIVE_THRESH, X_NEUTRAL_THRESH, }

export const initialCharacters = (function makeInitialCharacters(): Record<CharacterUid, CharacterMeta> {
    const nonPlayerCharacterPositions = makePositions(65, 50, 18, 13, 1)
    const playerCharacterPositions = makePositions(10, 50, 18, 13, 6)
    const all = [
        ...nonPlayerCharacterPositions.map(([x, y]) => newNPCMeta({ x, y, name: 'skeletonWarrior', uid: '' })),
        ...playerCharacterPositions.map(([x, y]) => newPCMeta({ x, y })),
    ]
    const o: Record<CharacterUid, CharacterMeta> = {}
    for (const c of all) {
        const uid = Math.random().toString().slice(2)
        o[uid] = c
        c.uid = uid
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
    const selectedMove = selectedCharacter.moves[0]
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
        doors: null,
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
        uid: '', // being set in makeInitialCharacters rn
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
export function newNPCMeta(args: { x: number; y: number, name: CharacterName, uid: string }): CharacterMeta {
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    return {
        ...statsMap[args.name],
        uid: args.uid, // being set in makeInitialCharacters rn
        isPc: false,
        x: args.x,
        y: args.y,
        screenX: scale * BASE_WIDTH * args.x / 100,
        screenY: scale * BASE_HEIGHT * args.y / 100,
        stance: 'neutral',
        hasMoved: false,
        health: statsMap[args.name].maxHealth,
    }
}
