import type {
    CharacterMeta,
    CharacterId,
    Characters,
    EnemyCharacterMeta,
    EnemyCharacterId,
    EnemyCharacters,
    OwnedCharacterStats,
    StanceId,
} from 'shared'
import { keys, vals } from 'shared/code'
import { enemies, getRulebook } from '@/rulebook'
import type { BaseHealth, EnemyDefinition } from '@/rulebook'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080
const X_AGGRESSIVE_THRESH = 11
const X_NEUTRAL_THRESH = 9

const CENTERING_X_OFFSET = 6 // out of 100

export function makeCharacters(chosen: OwnedCharacterStats[] = []): Characters {
    const playerCharacterPositions = makeLeftPositions()
    const all = [
        ...chosen.map((c, i) => {
            const [x, y] = playerCharacterPositions[i]
            return newPCMeta({ uid: c.uid, name: c.id, x, y })
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

export function getEnemyPositions(n: number) {
    return makePositions({
        n,
    })
}

function makeLeftPositions(): [
    [number, number],
    [number, number],
    [number, number]
] {
    const measurements = [
        [30.25, 34.2],
        [22.7, 50.23],
        [14.01, 67.16],
    ]

    return measurements.map(m => [m[0] + CENTERING_X_OFFSET, m[1]]) as [
        [number, number],
        [number, number],
        [number, number]
    ]
}

function makePositions({ n = 6 }: { n?: number }): [number, number][] {
    const measurements = [
        [55.55, 34.2],
        [60.9, 50.23],
        [68.07, 67.16],
        [76.37, 50],
        [69.62, 32.5],
        [82.13, 67.5],
    ]

    return measurements
        .map(m => [m[0] + CENTERING_X_OFFSET, m[1]] as [number, number])
        .slice(0, n)
}

function newPCMeta(args: {
    x: number
    y: number
    uid: string
    name: CharacterId
}): CharacterMeta {
    const { characters: statsMap } = getRulebook()
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    const stance: StanceId =
        args.x > X_AGGRESSIVE_THRESH
            ? 'aggressive'
            : args.x > X_NEUTRAL_THRESH
            ? 'neutral'
            : 'defensive'
    const stats = statsMap[args.name]
    return {
        ...stats,
        uid: args.uid,
        isPc: true,
        x: args.x,
        y: args.y,
        screenX: (scale * BASE_WIDTH * args.x) / 100,
        screenY: (scale * BASE_HEIGHT * args.y) / 100,
        stance,
        hasMoved: false,
        health: stats.constitution,
        block: 0,
        effects: [],
        orbs: [],
    }
}

export function newNPCMeta(args: {
    x: number
    y: number
    name: EnemyCharacterId
    uid: string
    level: string | number
}): EnemyCharacterMeta {
    const { name, level } = args
    const enemyDefinition = enemies[name][level] as EnemyDefinition
    // debugger

    return {
        ...enemyDefinition,
        id: name,
        displayName: '',
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
    }
}

function getHealthFromBase(base: BaseHealth): number {
    return parseInt(`${base}`)
}
