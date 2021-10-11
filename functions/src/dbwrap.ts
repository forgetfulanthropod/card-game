import { Gamestate } from './datamodel'

export function initialize(userCredentials) { }
export function getFromRulebook(key) { }
export function getFromGameState<K extends keyof Gamestate>(key: K): Gamestate[K] { }
export function setInGameState<K extends keyof Gamestate>(key: K, value: Gamestate[K]) { }
