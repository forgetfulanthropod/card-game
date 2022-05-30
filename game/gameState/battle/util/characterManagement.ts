import type {
    CharacterMeta,
    CharacterName,
    Characters,
    OwnedCharacterStats,
    StanceName,
} from 'shared'
import { keys, vals } from 'shared/code'
import { getRulebook } from '@/rulebook'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080
const X_AGGRESSIVE_THRESH = 11
const X_NEUTRAL_THRESH = 9

export function makeCharacters(chosen: OwnedCharacterStats[] = []): Characters {
    const playerCharacterPositions = makeLeftPositions()
    const all = [
        ...chosen.map((c, i) => {
            const [x, y] = playerCharacterPositions[i]
            return newPCMeta({ uid: c.uid, name: c.name, x, y })
        }),
    ]
    const o: Characters = {}
    for (const c of all) {
        o[c.uid] = c
    }
    return o
}

export function rearrangeNpcs(npcs: Characters): Characters {
    const positions = getEnemyPositions(keys(npcs).length)

    const rearrangedNpcs: Characters = {}

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
    const measureWFull = 1577
    const measureHFull = 886

    const measurements = [
        [477, 333],
        [358, 475],
        [271, 655],
    ]

    return measurements.map(m => [
        (m[0] / measureWFull) * 100,
        (m[1] / measureHFull) * 100,
    ]) as [[number, number], [number, number], [number, number]]
}

function makePositions({ n = 6 }: { n?: number }): [number, number][] {
    const measureWFull = 711
    const measureHFull = 400

    const measurements = [
        [458, 160],
        [433, 220],
        [405, 300],
        [533, 220],
        [558, 160],
        [505, 300],
    ]

    return measurements
        .map(
            m =>
                [(m[0] / measureWFull) * 100, (m[1] / measureHFull) * 100] as [
                    number,
                    number
                ]
        )
        .slice(0, n)
}

function newPCMeta(args: {
    x: number
    y: number
    uid: string
    name: CharacterName
}): CharacterMeta {
    const { characters: statsMap } = getRulebook()
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1
    const stance: StanceName =
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
    name: CharacterName
    uid: string
    level: string | number | null
}): CharacterMeta {
    const { characters: statsMap } = getRulebook()
    // debugger
    // logger.info(`making new npc with ${JSON.stringify(args)}`)
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1

    const stance: StanceName = 'neutral'
    return {
        ...statsMap[args.name],
        health: statsMap[args.name].constitution,
        block: 0,
        uid: args.uid,
        isPc: false,
        x: args.x,
        y: args.y,
        screenX: (scale * BASE_WIDTH * args.x) / 100,
        screenY: (scale * BASE_HEIGHT * args.y) / 100,
        stance,
        hasMoved: false,
        effects: [],
        orbs: [],
    }
}
