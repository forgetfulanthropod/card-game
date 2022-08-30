export type LootEarned = {
    items: LootFromGame
} & {
    claimed: boolean
}

export type LootFromGame = {
    gems: number
    tokenTBD: number
    placeholder: string
}

type LootBox = LootFromGame & 'potentially more stuff'
