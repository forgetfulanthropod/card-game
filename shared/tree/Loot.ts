export type LootEarned = {
    items: LootFromGame
} & {
    claimed: boolean
}

export type LootFromGame = {
    gems: number
    tokenTBD: number
    placeholder: string
    fishStick: number
    potion: number
    swordShield: number
    bread: number
}

type LootBox = LootFromGame & 'potentially more stuff'
