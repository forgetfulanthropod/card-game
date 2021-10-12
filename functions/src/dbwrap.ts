import { Gamestate } from '../../db/datamodel'

export function initialize(userCredentials: string) { }
export function getFromRulebook(key: string) { }
export function getFromGameState<K extends keyof Gamestate>(key: K): Gamestate[K] {
    return null as unknown as Gamestate[K]
}
export function setInGameState<K extends keyof Gamestate>(key: K, value: Gamestate[K]) { }
