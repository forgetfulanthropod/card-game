import type {
    Blessing,
    CharacterMeta,
    CharacterName,
    Characters,
    OwnedCharacterStats,
    StanceName,
} from 'shared'
import { getCharacterMovesWithDamageRanges } from './attack'
import { applyBlessings } from './blessings'
import { keys, vals } from '@/util'
import { getRulebook } from '@/rulebook'

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

export function getModified(
    blessings: Blessing[],
    prev: Readonly<CharacterMeta>
): CharacterMeta {
    const clean = cleanMeta(prev)

    const blessed = applyBlessings(blessings, clean)
    const stanced = {
        ...blessed,
        moves: getCharacterMovesWithDamageRanges(blessed),
    }

    const final = copyFinalProperties(stanced, prev)

    return final
}

function cleanMeta(cm: Readonly<CharacterMeta>): CharacterMeta {
    const character = cm.isPc ? newPCMeta(cm) : newNPCMeta(cm)

    return {
        ...character,
        stance: cm.stance,
        effects: cm.effects,
    }
}

function copyFinalProperties(
    to: Readonly<CharacterMeta>,
    from: CharacterMeta
): CharacterMeta {
    const deltaHealth = to.maxHealth - from.maxHealth
    const newHealth = Math.max(from.health + deltaHealth, 1)
    return {
        ...to,
        health: newHealth,
        hasMoved: from.hasMoved,
        experience: from.experience,
        block: from.block,
    }
}

type LevelInfo = {
    damage: number
    maxHealth: number
    level?: number
    health?: number
}

//For enemies above level 10, add +3 attack/+21 health per level.
const MAX_DATA_LEVEL = 10
const OVER_MAX_ATTACK = 3
const OVER_MAX_HEALTH = 21
export function getLevelInfo(name: CharacterName, level: number): LevelInfo {
    const { npcLevelStatsMap } = getRulebook()

    const index = Math.min(level, MAX_DATA_LEVEL)
    const levelInfo: LevelInfo | undefined = npcLevelStatsMap[name]?.[index]
    if (levelInfo == null) {
        throw Error('undefined level info')
    }
    logger.info({ levelInfo, level })

    if (level > MAX_DATA_LEVEL) {
        levelInfo.damage =
            levelInfo.damage + ((OVER_MAX_ATTACK * level) % MAX_DATA_LEVEL)
        levelInfo.maxHealth =
            levelInfo.maxHealth + ((OVER_MAX_HEALTH * level) % MAX_DATA_LEVEL)
    }

    levelInfo.health = levelInfo.maxHealth
    levelInfo.level = level

    return levelInfo
}
