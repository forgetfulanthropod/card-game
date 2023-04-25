import type { NextAction } from '@actions'
import type { Brandify, Scene } from '@misc'
import type { OwnedCharacterStatsMap } from './battle'
import { UserID } from './User'

export type GameState = Readonly<{
    scene: Scene
    ownedCharacters: OwnedCharacterStatsMap
    events: Record<string, unknown[]>
    rulebooks?: string[]
    curRulebook?: string
    userId: UserID
    nextAction: NextAction | null
}> &
    Brandify
