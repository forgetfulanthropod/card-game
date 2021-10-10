import { SceneName } from './types'
import { tree } from './rootTree'
import { makeInitialState as makeBattle } from './battle/factories'
import { makeInitialState as makeEntry } from './entry/factories'

const nameToFactory = {
    'battle': makeBattle,
    'dungeon entry': makeEntry,
}

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', nameToFactory[newSceneName]())
}
