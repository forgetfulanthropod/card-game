import { makeInitialState } from './factories'
import { scene } from 'data/rootTree'

type Set<T> = T | ((old: T) => T)
export type Action =
    | { a: 'setIsPlayerTurn', v: boolean }
    | { a: 'setBattleHasBegun' }
    | { a: 'setHasMoved', id: string, v: boolean }
    | { a: 'setHealth', id: string, h: Set<number> }
    | { a: 'clearHasMoved' }
    | { a: 'setSelectedCharacter', c: CharacterMeta }
    | { a: 'setSelectedMove', m: CharacterMove }
    | { a: 'fullReset' }
    | { a: 'updateScreenSize', size: Size }
    | { a: 'setIsBasicLoaded', v: boolean }
    | { a: 'setIsDeluxeLoaded', v: boolean }


export default function dispatch(action: Action): void {
    // console.log({ scene, action, data: scene.get() })
    // tl(`reducer received action ${JSON.stringify(action)}`)
    switch (action.a) {
        case 'setIsPlayerTurn': {
            // tl(`setting player turn to ${action.v}`)
            scene.set('isPlayerTurn', action.v)
            return
        } case 'setBattleHasBegun': {
            scene.set('battleHasBegun', true)
            return
        } case 'setHasMoved': {
            let notFound = true
            // scene.set('sdfdsf', scene.select('allCharacters').map((cursor, index) => {}) use this? (no)
            scene.apply('allCharacters', (ac) => ac.map(c => {
                if (c.id !== action.id) return c

                notFound = false
                return { ...c, hasMoved: true }
            }))

            if (notFound) { console.error(`couldn't find character with id ${action.id}`); return }
            return
        } case 'setHealth': {
            let notFound = true
            scene.apply('allCharacters', (ac) => ac.map(c => {
                if (c.id !== action.id) return c
                notFound = false
                return { ...c, health: typeof action.h === 'function' ? action.h(c.health) : action.h }
            }))

            // .allCharacters.find(c => c.id === action.id)
            if (notFound) { console.error(`couldn't find character with id ${action.id}`); return }

            return
        } case 'clearHasMoved': {
            scene.apply('allCharacters', (ac) => ac.map(c => ({ ...c, hasMoved: false })))
            return
        } case 'setSelectedCharacter': {
            scene.set('selectedCharacter', action.c)
            return
        } case 'setSelectedMove': {
            scene.set('selectedMove', action.m)
            return
        } case 'fullReset': {
            scene.set(makeInitialState())
            return
        } case 'updateScreenSize': {
            // debugger
            scene.apply('allCharacters', (ac) => {
                // debugger
                return ac.map(c =>
                ({
                    ...c,
                    screenX: c.x * action.size.width / 100,
                    screenY: c.y * action.size.height / 100,
                }))
            })
            return
        } case 'setIsBasicLoaded': {
            scene.set('isBasicLoaded', action.v)
            return
        } case 'setIsDeluxeLoaded': {
            scene.set('isDeluxeLoaded', action.v)
            return
        } default:
            throw new Error(`unknown action ${JSON.stringify(action)}`)
    }
}


export type Dispatcher = (a: Action) => void
