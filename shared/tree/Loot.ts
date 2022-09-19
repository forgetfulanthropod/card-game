export type LootFromGame =
    | 'draftCard'
    | 'gems'
    | 'tokenTBD'
    | 'fishStick'
    | 'potion'
    | 'swordShield'
    | 'bread'
    | 'treasureChest'

export type LootItem = {
    name: LootFromGame
    quantity: number
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

export type TreasureChestLevel = 1 | 2 | 3 | 4 | 5

export const MAX_CHEST_LEVEL = 5
