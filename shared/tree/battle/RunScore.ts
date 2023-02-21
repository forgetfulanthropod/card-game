import { RunID, UserID, Username } from '../User'
import { CharacterId, Characters, PlayerCharacterId } from './Characters'

export type RunScore = {
    totalScore: number
    currModifier: number
    attributes: Record<RunScoreAttributeName, number>
}

export type RunScoreUpdate = {
    event: NotifiableEvent
    count: number
    data?: any
}

export type RunScoreAttribute = {
    keyword: RunScoreAttributeName
    count: number
}

export type RunScoreAttributeName =
    | 'enemiesKilled'
    | 'roomsCleared' // exists as a sort of redundant data field (eg. it's also present at the top-level tree) mostly for convenience when updating and calculating score
    | 'bossesKilled'
    | 'perfectKills'
    | 'roomsExitedFullHealth'
    | 'bossRoomsExitedFullHealth'
    | 'bossRoomsExitedLowDamage'
    | 'winsNoEnergyUsedLastTurn'
    | 'highestDamageHit'
    | 'hitsOverVulgarThreshold'
    | 'survivingKaiju'
    | 'finalUserHealthRemaining'
    | 'roomsWonZeroDamage'
    | 'blocksOverThreshold'
    | 'cardsPlayedOverThreshold'
    | 'null' // used for derived and/or server side score events

export type RunScoreEventMeta = {
    description: string
    pointValue: number // eg. the number of points that 1 single "count" in RunScoreAttribute is worth
    attributeName: RunScoreAttributeName
    shortDescription: string
    keyword: string
    asset?: string
}

export type NotifiableEvent =
    | 'ENEMY_KILLED'
    | 'ROOM_CLEARED'
    | 'BOSS_KILLED'
    | 'PERFECT_KILL'
    | 'EXIT_ROOM_FULL_HEALTH'
    | 'EXIT_BOSS_FULL_HEALTH'
    | 'EXIT_BOSS_LOW_DAMAGE'
    | 'ROOM_WIN_NO_ENERGY_USED'
    | 'ROOM_WIN_ZERO_DAMAGE'

export type NonNotifiableEvent =
    | 'HIGHEST_DAMAGE'
    | 'SURVIVING_KAIJU'
    | 'FINAL_USER_HEALTH_REMAINING'
    | 'HIT_VULGAR_THRESHOLD'
    | 'BLOCK_OVER_THRESHOLD'
    | 'NULL'
    | 'CARDS_OVER_THRESHOLD'

export type RunScoreEvent = NotifiableEvent | NonNotifiableEvent

export const RUN_SCORE_EVENT_MAPPING: Record<
    RunScoreAttributeName,
    RunScoreEvent
> = {
    enemiesKilled: 'ENEMY_KILLED',
    roomsCleared: 'ROOM_CLEARED',
    perfectKills: 'PERFECT_KILL',
    bossesKilled: 'BOSS_KILLED',
    roomsExitedFullHealth: 'EXIT_ROOM_FULL_HEALTH',
    bossRoomsExitedFullHealth: 'EXIT_BOSS_FULL_HEALTH',
    highestDamageHit: 'HIGHEST_DAMAGE',
    hitsOverVulgarThreshold: 'HIT_VULGAR_THRESHOLD',
    bossRoomsExitedLowDamage: 'EXIT_BOSS_LOW_DAMAGE',
    winsNoEnergyUsedLastTurn: 'ROOM_WIN_NO_ENERGY_USED',
    finalUserHealthRemaining: 'FINAL_USER_HEALTH_REMAINING',
    survivingKaiju: 'SURVIVING_KAIJU',
    roomsWonZeroDamage: 'ROOM_WIN_ZERO_DAMAGE',
    blocksOverThreshold: 'BLOCK_OVER_THRESHOLD',
    cardsPlayedOverThreshold: 'CARDS_OVER_THRESHOLD',
    null: 'NULL',
}

//TODO: Adjust point values to remove decimals
export const RUN_SCORE_EVENT_META: Record<RunScoreEvent, RunScoreEventMeta> = {
    ENEMY_KILLED: {
        description: 'Aggregate enemy level of all enemies defeated',
        shortDescription: 'Combat Score',
        pointValue: 1,
        attributeName: 'enemiesKilled',
        keyword: 'Combat Score',
    },
    EXIT_ROOM_FULL_HEALTH: {
        description:
            'Number of battles completed with all party members having full health',
        pointValue: 2,
        shortDescription: 'Battles Completed with Full Health',
        attributeName: 'roomsExitedFullHealth',
        keyword: 'Mint Condition',
    },
    EXIT_BOSS_FULL_HEALTH: {
        description: 'Number of boss battles completed with full party health',
        shortDescription: 'Boss Battles Completed with Full Health',
        pointValue: 20,
        attributeName: 'bossRoomsExitedFullHealth',
        keyword: 'Was That A Boss?',
    },
    EXIT_BOSS_LOW_DAMAGE: {
        description:
            'Number of boss battles completed without losing more than 15 health',
        shortDescription: 'Complete a Boss Battle and lose less than 15 Health',
        pointValue: 15,
        attributeName: 'bossRoomsExitedLowDamage',
        keyword: 'Just a Fleshwound (Near Mint)',
    },
    BOSS_KILLED: {
        description: 'Number of bosses defeated',
        shortDescription: 'Bosses Defeated',
        pointValue: 10,
        attributeName: 'bossesKilled',
        keyword: 'Bosses Defeated',
    },
    ROOM_CLEARED: {
        description: 'Number of rooms cleared',
        shortDescription: 'Rooms Cleared',
        pointValue: 5,
        attributeName: 'roomsCleared',
        keyword: 'Rooms Cleared',
    },
    ROOM_WIN_NO_ENERGY_USED: {
        description:
            'Win a battle without spending any energy in the last turn',
        shortDescription: 'No Energy Used Last Turn',
        pointValue: 3,
        attributeName: 'winsNoEnergyUsedLastTurn',
        keyword: 'Walk Away',
    },
    PERFECT_KILL: {
        description:
            'Score a final hit against enemy exacly equal to its remaining health',
        shortDescription: 'Perfect Kills',
        pointValue: 2,
        attributeName: 'perfectKills',
        keyword: 'Perfect Kill',
    },
    HIGHEST_DAMAGE: {
        description: 'Highest damage from a single hit',
        shortDescription: 'Highest Damage From a Single Hit',
        pointValue: 0.25,
        attributeName: 'highestDamageHit',
        keyword: 'Number Go Up',
    },
    SURVIVING_KAIJU: {
        description: 'Number of party members alive at the end of run',
        shortDescription: 'Surviving Party Members',
        pointValue: 12,
        attributeName: 'survivingKaiju',
        keyword: 'Present and Accounted For',
    },
    FINAL_USER_HEALTH_REMAINING: {
        description: 'Amount of health remaining at the end of your run',
        shortDescription: 'Total Health Remaining',
        pointValue: 1,
        attributeName: 'finalUserHealthRemaining',
        keyword: 'For Your Health',
    },
    HIT_VULGAR_THRESHOLD: {
        description: 'Deal over 55 damage in a single turn',
        shortDescription: 'Deal Over 55 Damage in One Turn',
        pointValue: 1,
        attributeName: 'hitsOverVulgarThreshold',
        keyword: 'A Vulgar Display of Power',
    },
    ROOM_WIN_ZERO_DAMAGE: {
        description: 'Lose 0 health during a room',
        shortDescription: 'Rooms Beat with 0 Lost Health',
        pointValue: 4,
        attributeName: 'roomsWonZeroDamage',
        keyword: `Feelin' Fine`,
    },
    BLOCK_OVER_THRESHOLD: {
        description: 'Generate over 40 block in a single turn',
        shortDescription: 'Generate Over 40 Block in One Turn',
        pointValue: 2,
        attributeName: 'blocksOverThreshold',
        keyword: `Fortified`,
    },
    CARDS_OVER_THRESHOLD: {
        description: 'Play 5 or more cards in a single turn',
        shortDescription: 'Cards Over 5 Played',
        pointValue: 1,
        attributeName: 'cardsPlayedOverThreshold',
        keyword: `Long Combo`,
    },
    NULL: {
        description: 'Can be optionally used for derived events',
        shortDescription: 'NULL',
        pointValue: 0,
        attributeName: 'null',
        keyword: `Null`,
    },
}

export const RUN_TIME_THRESHOLD_MINS = 15

export type LeaderboardTimeToggle = 'daily' | 'weekly' | 'allTime'

export type MappedLeaderboards = {
    [key in LeaderboardTimeToggle]: Leaderboard
}

export type LeaderboardTimeframe = keyof MappedLeaderboards

export type Leaderboard = readonly LeaderboardEntry[]

export type LeaderboardEntry = {
    user_id: UserID
    wallet_address: string
    username: Username | null
    max_score: number
    start_ts: number // unix ts
    end_ts: number // unix ts
    run_id: RunID
    is_self: boolean
    leaderboard_rank: number // do not use
    adjusted_rank: number // use for both top 100 and self entry
    all_characters?: string // in reality is of Characters type, after parsing
    teamComp?: CharacterId[]
}

export type ScoreTags = {
    isNewHighScore: boolean
    topPercentile: number
}
