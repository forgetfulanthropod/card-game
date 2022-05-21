import type { OwnedCharacterStatsMap } from './Character'
import type { Brandify, Scene } from './misc'

export type Gamestate = Readonly<{
    scene: Scene
    ownedCharacters: OwnedCharacterStatsMap
    coin: number
    events: Record<string, unknown[]>
    rulebooks?: string[]
    curRulebook?: string
    username: string
}> &
    Brandify
