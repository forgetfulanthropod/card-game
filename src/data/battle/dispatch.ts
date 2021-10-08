import { getBattleScene } from 'data/rootTree'
import { makeInitialState } from './factories'
import { checkWinner } from './misc'
import { CharacterMove } from './constants'

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
    const scene = getBattleScene()
    switch (action.a) {
        case 'setIsPlayerTurn': {
            // tl(`setting player turn to ${action.v}`)
            scene.set('isPlayerTurn', action.v)
            return
        } case 'setBattleHasBegun': {
            scene.set('battleHasBegun', true)
            return
        } case 'setHasMoved': {
            // let notFound = true
            //@ts-ignore
            const charCursor = scene.select('allCharacters', { id: action.id }).set('hasMoved', true)
            // if (notFound) { console.error(`couldn't find character with id ${action.id}`); return }
            // rootTree.commit()
            return
        } case 'setHealth': {
            // let notFound = true
            //@ts-ignore
            const charCursor = scene.select('allCharacters', { id: action.id })
            //@ts-ignore
            charCursor.set('health', typeof action.h === 'function' ? action.h(charCursor.get('health')) : action.h)
            const winner = checkWinner(scene.select('allCharacters').get())
            if (winner === 'PC') scene.set('state', 'won')
            if (winner === 'NPC') scene.set('state', 'lost')

            // .allCharacters.find(c => c.id === action.id)
            // if (notFound) { console.error(`couldn't find character with id ${action.id}`); return }

            return
        } case 'clearHasMoved': {
            const cursor = scene.select('allCharacters')
            const n = cursor.get().length
            for (let i = 0; i < n; i++) {
                cursor.select(i).set('hasMoved', false)
            }
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
            const cursor = scene.select('allCharacters')
            const n = cursor.get().length
            for (let i = 0; i < n; i++) {
                const cu = cursor.select(i)
                const ch = cu.get()
                cu.merge({
                    screenX: ch.x * action.size.width / 100,
                    screenY: ch.y * action.size.height / 100,
                })
            }
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
