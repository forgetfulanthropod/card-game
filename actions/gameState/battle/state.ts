import type {
    BattleScene,
    CharacterMeta,
    CharacterName,
    CharacterUid,
    DungeonName,
    OwnedCharacter,
    StanceName
} from '@shared/index'

import { statsMap } from '../../rulebook/battle'


const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080
const X_AGGRESSIVE_THRESH = 11
const X_NEUTRAL_THRESH = 9

export const numbers = { BASE_WIDTH, BASE_HEIGHT, X_AGGRESSIVE_THRESH, X_NEUTRAL_THRESH, }

function makeCharacters(chosen: OwnedCharacter[] = []): Record<CharacterUid, CharacterMeta> {
    // const chosen = chosen ?? vals(initialOwnedCharacters())
    const nonPlayerCharacterPositions = makePositions(65, 50, 18, 13, 2)
    const playerCharacterPositions = makePositions(10, 50, 18, 13, chosen.length)

    const all = [
        ...nonPlayerCharacterPositions.map(([x, y]) => newNPCMeta({ x, y, name: 'skeletonWarrior', uid: 'makeCharacters' + Math.random().toString().slice(3, 6) })),
        ...chosen.map((c, i) => {
            const [x, y] = playerCharacterPositions[i]
            return newPCMeta({ uid: c.uid, name: c.name, x, y })
        }),
    ]
    const o: Record<CharacterUid, CharacterMeta> = {}
    for (const c of all) {
        o[c.uid] = c
    }
    return o
}

export function makeBattleState(args?: { chosen?: OwnedCharacter[], dungeonName?: DungeonName }): BattleScene {
    const allCharacters = makeCharacters(args.chosen)

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
        dungeonName: args.dungeonName ?? 'The Matcha Caves',
        turnCount: 0,
        state: 'not started',
        isPlayerTurn: Math.random() < .5,
        battleHasBegun: true,
        allCharacters,
        selectedCharacter: selectedCharacter.uid,
        selectedMove,
        isBasicLoaded: false,
        isDeluxeLoaded: false,
        doors: { options: [], descriptions: [] },
        roomsPassed: 0
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

function newPCMeta(args: { x: number; y: number, uid: string, name: CharacterName }): CharacterMeta {
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    const stance: StanceName = args.x > X_AGGRESSIVE_THRESH ?
        'aggressive' :
        (args.x > X_NEUTRAL_THRESH ? 'neutral' : 'defensive')
    const stats = statsMap[args.name]
    return {
        ...stats,
        uid: args.uid,
        isPc: true,
        x: args.x,
        y: args.y,
        screenX: scale * BASE_WIDTH * args.x / 100,
        screenY: scale * BASE_HEIGHT * args.y / 100,
        stance,
        hasMoved: false,
        health: stats.maxHealth,
    }
}
export function newNPCMeta(args: { x: number; y: number, name: CharacterName, uid: string }): CharacterMeta {
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    // console.log('args.name', args.name)
    // console.log('statsMap[args.name]', statsMap[args.name])
    // console.log('statsMap', statsMap)
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
        // health: 1,
    }
}

function randString(): string {
    return Math.random().toString().slice(2)
}
