import type {
    CharacterMeta,
    CharacterId,
    Characters,
    EnemyCharacterMeta,
    NonPlayerCharacterId,
    EnemyCharacters,
    OwnedCharacterStats,
    StanceId,
    PlayerCharacterId,
} from 'shared'
import { keys, vals } from 'shared/code'
import { npcStatsMapByLevel, getRulebook } from '@/rulebook'
import type { BaseHealth, EnemyDefinition } from '@/rulebook'
import { playerCharacterStatsMap } from '@/rulebook/battle'
import { calculateStats } from '../characters/effects'
import { startCase } from 'lodash'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080
const X_AGGRESSIVE_THRESH = 11
const X_NEUTRAL_THRESH = 9

const CENTERING_X_OFFSET = 5 // out of 100

export function makeCharacters(chosen: OwnedCharacterStats[] = []): Characters {
    const playerCharacterPositions = makeLeftPositions()
    const all = [
        ...chosen.map((c, i) => {
            const [x, y] = playerCharacterPositions[i]
            return newPCMeta({
                uid: c.uid,
                name: c.id as PlayerCharacterId,
                x,
                y,
            })
        }),
    ]
    const o: Characters = {}
    for (const c of all) {
        o[c.uid] = c
    }
    return o
}

export function rearrangeNpcs(npcs: EnemyCharacters): EnemyCharacters {
    const positions = getEnemyPositions(keys(npcs).length)

    const rearrangedNpcs: EnemyCharacters = {}

    const npcKeys = keys(npcs)
    vals(npcs).forEach((npc, i) => {
        const [x, y] = positions[i]

        rearrangedNpcs[npcKeys[i]] = {
            ...npc,
            x,
            y,
            screenX: (BASE_WIDTH * x) / 100,
            screenY: (BASE_HEIGHT * y) / 100,
        }
    })

    return rearrangedNpcs
}

export function getEnemyPositions(n: number): [number, number][] {
    const threePoints = getThreePointGrid()

    if (n === 1) return [threePoints[1]]

    if (n === 2)
        return [
            positionBetween(threePoints[0], threePoints[1]),
            positionBetween(threePoints[1], threePoints[2]),
        ]

    return threePoints
}

function makeLeftPositions(): [
    [number, number],
    [number, number],
    [number, number]
] {
    const measurements = [
        [31, 34.2],
        [18.5, 50.23],
        [6, 67.16],
    ]

    return measurements.map(m => [m[0] + CENTERING_X_OFFSET, m[1]]) as [
        [number, number],
        [number, number],
        [number, number]
    ]
}

function getThreePointGrid() {
    const measurements = [
        [60.37, 34.2],
        [69.62, 50.23],
        [78.13, 67.16],
    ]

    return measurements.map(
        m => [m[0] + CENTERING_X_OFFSET, m[1]] as [number, number]
    )
}

function newPCMeta(args: {
    x: number
    y: number
    uid: string
    name: PlayerCharacterId
}): CharacterMeta {
    const { characters: statsMap } = getRulebook()
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    const stance: StanceId = 'neutral'
    const stats = statsMap[args.name]
    const characterMeta = {
        ...stats,
        uid: args.uid,
        isPc: true,
        x: args.x,
        y: args.y,
        screenX: (scale * BASE_WIDTH * args.x) / 100,
        screenY: (scale * BASE_HEIGHT * args.y) / 100,
        stance,
        stanceInPrevTurn: stance,
        hasMoved: false,
        health: stats.constitution,
        block: 0,
        effects: [],
        orbs: [],
        statModifiersMap: {
            turn: {},
            room: {},
            run: {},
        },
    }
    return { ...characterMeta, calculatedStats: calculateStats(characterMeta) }
}

export function newNPCMeta(args: {
    x: number
    y: number
    name: NonPlayerCharacterId
    uid: string
    level: string | number
}): EnemyCharacterMeta {
    const { name, level } = args
    const enemyDefinition = npcStatsMapByLevel[name][level] as EnemyDefinition
    // debugger

    const cm = {
        ...enemyDefinition,
        id: name,
        displayName: startCase(name),
        health: getHealthFromBase(enemyDefinition.constitution),
        constitution: getHealthFromBase(enemyDefinition.constitution),
        block: 0,
        uid: args.uid,
        isPc: false,
        x: args.x,
        y: args.y,
        screenX: (BASE_WIDTH * args.x) / 100,
        screenY: (BASE_HEIGHT * args.y) / 100,
        hasMoved: false,
        effects: [],
        orbs: [],
        statModifiersMap: {
            turn: {},
            room: {},
            run: {},
        },
    }

    return { ...cm, calculatedStats: calculateStats(cm) }
}

function getHealthFromBase(base: BaseHealth): number {
    return parseInt(`${base}`)
}

function positionBetween(
    arg0: [number, number],
    arg1: [number, number]
): [number, number] {
    return [(arg0[0] + arg1[0]) / 2, (arg0[1] + arg1[1]) / 2]
}
