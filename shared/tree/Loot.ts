export type LootEarned = {
    items: LootFromGame
    claimed: boolean
}

export type LootFromGame = {
    draftCard: number
    gems: number
    tokenTBD: number
    fishStick: number
    potion: number
    swordShield: number
    bread: number
}

type LootBox = LootFromGame & 'potentially more stuff'
