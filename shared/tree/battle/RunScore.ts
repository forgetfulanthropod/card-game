export type RunScore = {
    totalScore: number
    currModifier: number
    attributes: Record<RunScoreAttributeName, number>
}

export type RunScoreAttribute = {
    keyword: RunScoreAttributeName
    count: number
}

export type RunScoreAttributeName =
    | 'enemiesKilled'
    | 'roomsCleared' // exists as a sort of redundant data field (eg. it's also present at the top-level tree) mostly for convenience when updating and calculating score
    | 'bossesKilled'
    | 'cumulativeOverkill'
    | 'perfectKills'
    | 'roomsExitedFullHealth'
    | 'bossRoomsExitedFullHealth'
    | 'bossRoomsExitedLowDamage'
    | 'winsNoEnergyUsedLastTurn'
    | 'highestDamageHit'
    | 'hitsOverVulgarThreshold'
    | 'minsUnderRunThreshold'
    | 'survivingKaiju'
    | 'finalUserHealthRemaining'
    | 'roomsWonZeroDamage'
    | 'blocksOverThreshold'
    | 'roomsZeroStanceChanges'
    | 'stanceChangesOverThreshold'
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
    | 'OVERKILL'
    | 'PERFECT_KILL'
    | 'EXIT_ROOM_FULL_HEALTH'
    | 'EXIT_BOSS_FULL_HEALTH'
    | 'EXIT_BOSS_LOW_DAMAGE'
    | 'ROOM_WIN_NO_ENERGY_USED'
    | 'ROOM_WIN_ZERO_DAMAGE'

export type NonNotifiableEvent =
    | 'HIGHEST_DAMAGE'
    | 'RUN_COMPLETED'
    | 'SURVIVING_KAIJU'
    | 'FINAL_USER_HEALTH_REMAINING'
    | 'HIT_VULGAR_THRESHOLD'
    | 'BLOCK_OVER_THRESHOLD'
    | 'NULL'
    | 'STANCE_CHANGES_OVER'
    | 'STANCE_CHANGES_UNDER'
    | 'CARDS_OVER_THRESHOLD'

export type RunScoreEvent = NotifiableEvent | NonNotifiableEvent

export const RUN_SCORE_EVENT_MAPPING: Record<
    RunScoreAttributeName,
    RunScoreEvent
> = {
    enemiesKilled: 'ENEMY_KILLED',
    roomsCleared: 'ROOM_CLEARED',
    cumulativeOverkill: 'OVERKILL',
    perfectKills: 'PERFECT_KILL',
    bossesKilled: 'BOSS_KILLED',
    roomsExitedFullHealth: 'EXIT_ROOM_FULL_HEALTH',
    bossRoomsExitedFullHealth: 'EXIT_BOSS_FULL_HEALTH',
    highestDamageHit: 'HIGHEST_DAMAGE',
    hitsOverVulgarThreshold: 'HIT_VULGAR_THRESHOLD',
    minsUnderRunThreshold: 'RUN_COMPLETED',
    bossRoomsExitedLowDamage: 'EXIT_BOSS_LOW_DAMAGE',
    winsNoEnergyUsedLastTurn: 'ROOM_WIN_NO_ENERGY_USED',
    finalUserHealthRemaining: 'FINAL_USER_HEALTH_REMAINING',
    survivingKaiju: 'SURVIVING_KAIJU',
    roomsWonZeroDamage: 'ROOM_WIN_ZERO_DAMAGE',
    blocksOverThreshold: 'BLOCK_OVER_THRESHOLD',
    stanceChangesOverThreshold: 'STANCE_CHANGES_OVER',
    roomsZeroStanceChanges: 'STANCE_CHANGES_UNDER',
    cardsPlayedOverThreshold: 'CARDS_OVER_THRESHOLD',
    null: 'NULL',
}

//TODO: Adjust point values to remove decimals
export const RUN_SCORE_EVENT_META: Record<RunScoreEvent, RunScoreEventMeta> = {
    ENEMY_KILLED: {
        description: 'Number of enemies defeated',
        shortDescription: 'Enemies Defeated',
        pointValue: 1,
        attributeName: 'enemiesKilled',
        keyword: 'Enemies Defeated',
    },
    EXIT_ROOM_FULL_HEALTH: {
        description:
            'Number of normal battles completed with full party health',
        pointValue: 4,
        shortDescription: 'Rooms Completed with Full Health',
        attributeName: 'roomsExitedFullHealth',
        keyword: 'Grunts',
    },
    EXIT_BOSS_FULL_HEALTH: {
        description: 'Number of boss battles completed with full party health',
        shortDescription: 'Boss Rooms Completed in Full Health',
        pointValue: 20,
        attributeName: 'bossRoomsExitedFullHealth',
        keyword: 'Was That A Boss?',
    },
    EXIT_BOSS_LOW_DAMAGE: {
        description: 'Exit Boss Battle without losing more than 15 health',
        shortDescription: 'Boss Battles Lost <15 Health',
        pointValue: 15,
        attributeName: 'bossRoomsExitedFullHealth',
        keyword: 'Just a Fleshwound',
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
        description: 'Won battle without spending energy in last turn',
        shortDescription: 'Battle Won w/Idle Last Turn',
        pointValue: 3,
        attributeName: 'winsNoEnergyUsedLastTurn',
        keyword: 'Walk Away',
    },
    OVERKILL: {
        description: 'Cumulative damage inflicted on top of dead enemy',
        shortDescription: 'Cumulative Overkill',
        pointValue: 0.25,
        attributeName: 'cumulativeOverkill',
        keyword: 'Overkill',
    },
    PERFECT_KILL: {
        description:
            'Final hit against enemy exacly equal to its remaining health',
        shortDescription: 'Perfect Kills',
        pointValue: 4,
        attributeName: 'perfectKills',
        keyword: 'Perfect Kill',
    },
    HIGHEST_DAMAGE: {
        description: 'Highest damage from single hit',
        shortDescription: 'Highest Damage From Single Hit',
        pointValue: 0.3,
        attributeName: 'highestDamageHit',
        keyword: 'Number Go Up',
    },
    RUN_COMPLETED: {
        description: 'Completed run under 15 minutes',
        shortDescription: 'Completed Run Under 15 Mins',
        pointValue: 3,
        attributeName: 'null',
        keyword: `Mustn't Tarry`,
    },
    SURVIVING_KAIJU: {
        description: 'Number of Kaiju alive at the end of run',
        shortDescription: 'Surviving Kaiju',
        pointValue: 8,
        attributeName: 'survivingKaiju',
        keyword: 'Present and Accounted For',
    },
    FINAL_USER_HEALTH_REMAINING: {
        description: 'Amount of health remaining at end of run',
        shortDescription: 'Total Health Remaining',
        pointValue: 0.15,
        attributeName: 'finalUserHealthRemaining',
        keyword: 'For Your Health',
    },
    HIT_VULGAR_THRESHOLD: {
        description: 'Number of hits that dealt >55 damage in a single turn',
        shortDescription: 'Hits Dealt Over 55 Damage',
        pointValue: 2,
        attributeName: 'hitsOverVulgarThreshold',
        keyword: 'A Vulgar Display of Power',
    },
    ROOM_WIN_ZERO_DAMAGE: {
        description: 'Lose 0 health during a room',
        shortDescription: 'Rooms Beat with 0 Lost Health',
        pointValue: 5,
        attributeName: 'roomsWonZeroDamage',
        keyword: `Feelin' Fine`,
    },
    BLOCK_OVER_THRESHOLD: {
        description: 'Generate over 40 block in a single turn',
        shortDescription: 'Turns with Over 40 Block',
        pointValue: 2,
        attributeName: 'blocksOverThreshold',
        keyword: `Fortified`,
    },
    STANCE_CHANGES_OVER: {
        description: 'Stances Changed',
        shortDescription: 'Number of stance changes over 5 in a single battle',
        pointValue: 1,
        attributeName: 'stanceChangesOverThreshold',
        keyword: `Quick Footed`,
    },
    STANCE_CHANGES_UNDER: {
        description: 'Stances Changed Under',
        shortDescription: "Didn't change character stances in a battle",
        pointValue: 7,
        attributeName: 'roomsZeroStanceChanges',
        keyword: `Steady Stance`,
    },
    CARDS_OVER_THRESHOLD: {
        description: 'Play 5 or more cards in a single turn',
        shortDescription: 'Cards Over 5 Played',
        pointValue: 2,
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
