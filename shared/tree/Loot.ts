export type LootFromGame =
    | 'draftCard'
    | 'gems'
    | 'tokenTBD'
    | 'fishStick'
    | 'potion'
    | 'swordShield'
    | 'bread'

export type LootItem = {
    name: LootFromGame
    quantity: number
}

export type ClaimableLoot = Array<LootItem>
export type ClaimedLoot = Array<LootItem>

type LootBox = LootFromGame & 'potentially more stuff'
