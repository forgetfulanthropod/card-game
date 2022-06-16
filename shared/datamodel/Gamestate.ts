import type { OwnedCharacterStatsMap } from './Character'
import type { Brandify, Scene } from './misc'
import type { NextAction } from '@'

export type Gamestate = Readonly<{
    scene: Scene
    ownedCharacters: OwnedCharacterStatsMap
    events: Record<string, unknown[]>
    rulebooks?: string[]
    curRulebook?: string
    username: string
    nextAction: NextAction | null
}> &
    Brandify
