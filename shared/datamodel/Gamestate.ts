import type { Blessing } from './Blessing'
import type { OwnedCharacterStatsMap } from './Character'
import type { Brandify, Scene } from './misc'
import type { ItemName, ItemUid } from '@'

export type Gamestate = Readonly<{
    scene: Scene
    ownedCharacters: OwnedCharacterStatsMap
    inventory: Record<ItemUid, ItemName>
    coin: number
    blessings: Blessing[]
    events: Record<string, unknown[]>
    rulebooks?: string[]
    curRulebook?: string
    username: string
}> &
    Brandify
