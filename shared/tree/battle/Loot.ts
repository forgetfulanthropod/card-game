export type LootFromGame =
    | 'draftCard'
    | 'gems'
    | 'fish'
    | 'copper'
    | 'stone'
    | 'gold'
    | 'wood'
    | 'treasureChest'

export type LootItem = {
    name: LootFromGame
    count: number
}

export type ClaimableLoot = Array<LootItem>
export type ClaimedLoot = Array<LootItem>

type LootBox = LootFromGame & 'potentially more stuff'

export type TreasureChest = {
    level: TreasureChestLevel
    progressPct: number
    state: 'pending' | 'calculated'
    upgraded: boolean
}

export const TreasureChestLevelThreshold: Record<TreasureChestLevel, number> = {
    0: 0,
    1: 100,
    2: 200,
    3: 400,
    4: 700,
    5: 1200,
}

export type TreasureChestLevel = 0 | 1 | 2 | 3 | 4 | 5

export const MAX_CHEST_LEVEL = 5
