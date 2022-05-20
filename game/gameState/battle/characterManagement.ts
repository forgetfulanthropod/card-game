import type {
    Blessing,
    CharacterMeta,
    CharacterName,
    Characters,
    OwnedCharacterStats,
    StanceName,
} from 'shared'

import { getModified } from './characterModifierManagement'
import { getLevelInfo } from './npcLeveling'
import { getRulebook } from '@/rulebook'
import { keys, vals } from '@/util'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080
const X_AGGRESSIVE_THRESH = 11
const X_NEUTRAL_THRESH = 9

export function makeCharacters(
    chosen: OwnedCharacterStats[] = [],
    blessings: Blessing[]
): Characters {
    const playerCharacterPositions = makePositions({
        x0: 10,
        y0: 50,
        hGap: 18,
        vGap: 13,
        n: chosen.length,
    })
    const all = [
        ...chosen.map((c, i) => {
            const [x, y] = playerCharacterPositions[i]
            return getModified(
                blessings,
                newPCMeta({ uid: c.uid, name: c.name, x, y })
            )
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
        x0: 70,
        y0: 50,
        hGap: 18,
        vGap: 13,
        n,
    })
}

function makePositions({
    x0,
    y0,
    hGap,
    vGap,
    n = 6,
}: {
    x0: number
    y0: number
    hGap: number
    vGap: number
    n?: number
}): [number, number][] {
    const A: [number, number][] = [
        [x0, y0],
        [x0 + hGap, y0],
        [x0 - hGap / 2, y0 + vGap],
        [x0 + hGap / 2, y0 + vGap],
        [x0, y0 + vGap * 2],
        [x0 + hGap, y0 + vGap * 2],
        [x0 - hGap, y0 + vGap * 2],
        [x0 - hGap, y0 - vGap * 2],
    ]
    return A.slice(0, n)
}

export function newPCMeta(args: {
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
    // HERE: mutateCharacterForBlessingsCurrentlyEnabledByTheAdminInterface__LaterWillBeEventBasedBlessingsButItDoesntEffectThisFunction__PART2(stats)
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
        health: stats.maxHealth,
        block: 0,
        experience: 0,
        effects: [],
        orbs: [],
    }
}
export function newNPCMeta(args: {
    x: number
    y: number
    name: CharacterName
    uid: string
    level: number
}): CharacterMeta {
    const { characters: statsMap } = getRulebook()
    // debugger
    logger.info(`making new npc with ${JSON.stringify(args)}`)
    // const scale = window.innerWidth / BASE_WIDTH
    const scale = 1

    const stance: StanceName = 'neutral'
    return {
        ...statsMap[args.name],
        health: statsMap[args.name].maxHealth,
        block: 0,
        ...getLevelInfo(args.name, args.level),
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
        experience: 0,
        // health: 1,
    }
}
