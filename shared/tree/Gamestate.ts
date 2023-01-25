import type { NextAction } from '@actions'
import type { Brandify, Scene } from '@misc'
import type { OwnedCharacterStatsMap } from './battle'

export type GameState = Readonly<{
    scene: Scene
    ownedCharacters: OwnedCharacterStatsMap
    events: Record<string, unknown[]>
    rulebooks?: string[]
    curRulebook?: string
    username: string
    nextAction: NextAction | null
}> &
    Brandify
