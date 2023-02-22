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
    | 'roomClearSpeed'
    | 'bossesKilled'
    | 'perfectKills'
    | 'overkills'
    | 'roomsExitedFullHealth'
    | 'bossRoomsExitedFullHealth'
    | 'bossRoomsExitedLowDamage'
    | 'winsNoEnergyUsedLastTurn'
    | 'highestDamageHit'
    | 'hitsOverVulgarThreshold'
    | 'survivingKaiju'
    | 'finalUserHealthRemaining'
    | 'roomsWonZeroDamage'
    | 'roomsWonFiveDamage'
    | 'roomsTake100Damage'
    | 'blocksOverThreshold'
    | 'cardsPlayedOverThreshold'
    | 'cardsWholeParty'
    | 'cardsDraftBalanced'
    | 'roomClearDifficulty'
    | 'null' // used for derived and/or server side score events

export type RunScoreEventMeta = {
    description: string
    pointValue: number // eg. the number of points that 1 single "count" in RunScoreAttribute is worth
    attributeName: RunScoreAttributeName
    shortDescription: string
    keyword: string
    increment: boolean
    asset?: string
}

export type NotifiableEvent =
    | 'ENEMY_KILLED'
    | 'ROOM_CLEARED'
    | 'BOSS_KILLED'
    | 'PERFECT_KILL'
    | 'OVERKILL'
    | 'EXIT_ROOM_FULL_HEALTH'
    | 'EXIT_BOSS_FULL_HEALTH'
    | 'EXIT_BOSS_LOW_DAMAGE'
    | 'ROOM_WIN_NO_ENERGY_USED'
    | 'ROOM_WIN_ZERO_DAMAGE'
    | 'ROOM_WIN_FIVE_DAMAGE'
    | 'ROOM_TAKE_100_DAMAGE'
    | 'ROOM_CLEAR_SPEED'
    | 'ROOM_CLEAR_DIFFICULTY'
    | 'CARDS_WHOLE_PARTY'

export type NonNotifiableEvent =
    | 'HIGHEST_DAMAGE'
    | 'SURVIVING_KAIJU'
    | 'FINAL_USER_HEALTH_REMAINING'
    | 'HIT_VULGAR_THRESHOLD'
    | 'BLOCK_OVER_THRESHOLD'
    | 'NULL'
    | 'CARDS_OVER_THRESHOLD'
    | 'CARDS_DRAFT_BALANCED'

export type RunScoreEvent = NotifiableEvent | NonNotifiableEvent

export const RUN_SCORE_EVENT_MAPPING: Record<
    RunScoreAttributeName,
    RunScoreEvent
> = {
    enemiesKilled: 'ENEMY_KILLED',
    roomsCleared: 'ROOM_CLEARED',
    roomClearDifficulty: 'ROOM_CLEAR_DIFFICULTY',
    roomClearSpeed: 'ROOM_CLEAR_SPEED',
    perfectKills: 'PERFECT_KILL',
    overkills: 'OVERKILL',
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
    roomsWonFiveDamage: 'ROOM_WIN_FIVE_DAMAGE',
    roomsTake100Damage: 'ROOM_TAKE_100_DAMAGE',
    blocksOverThreshold: 'BLOCK_OVER_THRESHOLD',
    cardsPlayedOverThreshold: 'CARDS_OVER_THRESHOLD',
    cardsWholeParty: 'CARDS_WHOLE_PARTY',
    cardsDraftBalanced: 'CARDS_DRAFT_BALANCED',
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
        increment: true,
    },
    EXIT_ROOM_FULL_HEALTH: {
        description:
            'Number of battles completed with all party members having full health',
        pointValue: 2,
        shortDescription: 'Battles Completed with Full Health',
        attributeName: 'roomsExitedFullHealth',
        keyword: 'Mint Condition',
        increment: true,
    },
    EXIT_BOSS_FULL_HEALTH: {
        description: 'Number of boss battles completed with full party health',
        shortDescription: 'Boss Battles Completed with Full Health',
        pointValue: 20,
        attributeName: 'bossRoomsExitedFullHealth',
        keyword: 'Was That A Boss?',
        increment: true,
    },
    EXIT_BOSS_LOW_DAMAGE: {
        description:
            'Number of boss battles completed without losing more than 15 health',
        shortDescription: 'Complete a Boss Battle and lose less than 15 Health',
        pointValue: 15,
        attributeName: 'bossRoomsExitedLowDamage',
        keyword: 'Just a Fleshwound (Near Mint)',
        increment: true,
    },
    BOSS_KILLED: {
        description: 'Number of bosses defeated',
        shortDescription: 'Bosses Defeated',
        pointValue: 10,
        attributeName: 'bossesKilled',
        keyword: 'Bosses Defeated',
        increment: true,
    },
    ROOM_CLEARED: {
        description: 'Number of rooms cleared',
        shortDescription: 'Rooms Cleared',
        pointValue: 5,
        attributeName: 'roomsCleared',
        keyword: 'Rooms Cleared',
        increment: true,
    },
    ROOM_CLEAR_DIFFICULTY: {
        description:
            '3 bonus points for every difficulty level 4 room defeated, 2 bonus points for every difficulty level 3 room defeated.',
        shortDescription: 'Rooms Cleared Difficulty',
        pointValue: 1,
        attributeName: 'roomClearDifficulty',
        keyword: 'The Hard Way',
        increment: true,
    },
    ROOM_CLEAR_SPEED: {
        description: 'Room clear speed',
        shortDescription:
            'bonus points based on finishing a room by a turn count',
        pointValue: 1,
        attributeName: 'roomClearSpeed',
        keyword: "Mustn't Tarry",
        increment: true,
    },
    ROOM_WIN_NO_ENERGY_USED: {
        description:
            'Win a battle without spending any energy in the last turn',
        shortDescription: 'No Energy Used Last Turn',
        pointValue: 3,
        attributeName: 'winsNoEnergyUsedLastTurn',
        keyword: 'Walk Away',
        increment: true,
    },
    PERFECT_KILL: {
        description:
            'Score a final hit against enemy exacly equal to its remaining health',
        shortDescription: 'Perfect Kills',
        pointValue: 2,
        attributeName: 'perfectKills',
        keyword: 'Perfect Kill',
        increment: true,
    },
    OVERKILL: {
        description: 'Overkill an enemy by 20 or more health',
        shortDescription: 'No Mercy',
        pointValue: 1,
        attributeName: 'overkills',
        keyword: 'No Mercy',
        increment: true,
    },
    HIGHEST_DAMAGE: {
        description: 'Highest damage from a single hit',
        shortDescription: 'Highest Damage From a Single Hit',
        pointValue: 0.25,
        attributeName: 'highestDamageHit',
        keyword: 'Number Go Up',
        increment: false,
    },
    SURVIVING_KAIJU: {
        description: 'Number of party members alive at the end of run',
        shortDescription: 'Surviving Party Members',
        pointValue: 12,
        attributeName: 'survivingKaiju',
        keyword: 'Present and Accounted For',
        increment: false,
    },
    FINAL_USER_HEALTH_REMAINING: {
        description:
            'Amount of health remaining at the end of your run: 3 points per 10% of max HP per character (max 90 points)',
        shortDescription: 'Total Health Remaining',
        pointValue: 1,
        attributeName: 'finalUserHealthRemaining',
        keyword: 'For Your Health',
        increment: false,
    },
    HIT_VULGAR_THRESHOLD: {
        description: 'Deal over 55 damage in a single turn',
        shortDescription: 'Deal Over 55 Damage in One Turn',
        pointValue: 1,
        attributeName: 'hitsOverVulgarThreshold',
        keyword: 'A Vulgar Display of Power',
        increment: true,
    },
    ROOM_WIN_ZERO_DAMAGE: {
        description: 'Lose 0 health during a room',
        shortDescription: 'Rooms Beat with 0 Lost Health',
        pointValue: 4,
        attributeName: 'roomsWonZeroDamage',
        keyword: `Feelin' Fine`,
        increment: true,
    },
    ROOM_WIN_FIVE_DAMAGE: {
        description: 'Lose fewer than 5 health points during a room',
        shortDescription: 'Rooms Beat losing a little health',
        pointValue: 3,
        attributeName: 'roomsWonFiveDamage',
        keyword: `A-`,
        increment: true,
    },
    ROOM_TAKE_100_DAMAGE: {
        description: 'Lose over 100 health in one room',
        shortDescription: 'Lose over 100 health in one room',
        pointValue: 5,
        attributeName: 'roomsTake100Damage',
        keyword: `Sorry That Happened To You`,
        increment: true,
    },
    BLOCK_OVER_THRESHOLD: {
        description: 'Generate over 40 block in a single turn',
        shortDescription: 'Generate Over 40 Block in One Turn',
        pointValue: 2,
        attributeName: 'blocksOverThreshold',
        keyword: `Fortified`,
        increment: true,
    },
    CARDS_OVER_THRESHOLD: {
        description: 'Play 5 or more cards in a single turn',
        shortDescription: 'Cards Over 5 Played',
        pointValue: 1,
        attributeName: 'cardsPlayedOverThreshold',
        keyword: `Long Combo`,
        increment: true,
    },
    CARDS_WHOLE_PARTY: {
        description: 'Have each of your 3 Kaiju play a card in a single turn',
        shortDescription:
            'Play a card by every character in your party in a single turn (max 1 point per room, only scorable if all 3 characters are alive)',
        pointValue: 1,
        attributeName: 'cardsWholeParty',
        keyword: `Taking Turns, Playing Nice`,
        increment: true,
    },
    CARDS_DRAFT_BALANCED: {
        description: `Draft a card type that's different than the last two types of cards you've drafted`,
        shortDescription: 'Draw cards of different types',
        pointValue: 1,
        attributeName: 'cardsDraftBalanced',
        keyword: `A Balanced Portfolio`,
        increment: true,
    },
    NULL: {
        description: 'Can be optionally used for derived events',
        shortDescription: 'NULL',
        pointValue: 0,
        attributeName: 'null',
        keyword: `Null`,
        increment: true,
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
