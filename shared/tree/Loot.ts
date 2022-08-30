export type LootEarned = {
    items: { [key in LootFromGame]: number }
} & {
    claimed: false
}

export type LootFromGame = 'gems' | 'tokenTBD' | 'placeholder'

type LootBox = LootFromGame & 'potentially more stuff'
