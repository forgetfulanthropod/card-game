import { getBattleScene } from '@/data/rootTree'
import { keys, vals } from '@/util'
import { initialBattleState } from '@@/db/battle/state'
import { CharacterMeta, CharacterMove } from '../types'
import { checkWinner } from './misc'

type Set<T> = T | ((old: T) => T)
export type Action =
    | { a: 'setIsPlayerTurn', v: boolean }
    | { a: 'setBattleHasBegun' }
    | { a: 'setHasMoved', uid: string, v: boolean }
    | { a: 'setHealth', uid: string, h: Set<number> }
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
            scene.set('state', 'in battle')
            return
        } case 'setHasMoved': {
            // let notFound = true
            scene.select('allCharacters').select(action.uid).set('hasMoved', true)
            // if (notFound) { console.error(`couldn't find character with id ${action.id}`); return }
            // rootTree.commit()
            return
        } case 'setHealth': {
            console.log('setting health of', action.uid)
            // debugger
            // let notFound = true
            const charCursor = scene.select('allCharacters').select(action.uid)
            charCursor.set('health', typeof action.h === 'function' ? action.h(charCursor.get('health')) : action.h)
            const winner = checkWinner(vals(scene.select('allCharacters').get()))
            if (winner === 'PC') scene.set('state', 'won')
            if (winner === 'NPC') scene.set('state', 'lost')

            // .allCharacters.find(c => c.id === action.id)
            // if (notFound) { console.error(`couldn't find character with id ${action.id}`); return }

            return
        } case 'clearHasMoved': {
            const cursor = scene.select('allCharacters')
            for (const k of keys(cursor.get())) {
                cursor.select(k).set('hasMoved', false)
            }
            return
        } case 'setSelectedCharacter': {
            scene.set('selectedCharacter', action.c.uid)
            return
        } case 'setSelectedMove': {
            scene.set('selectedMove', action.m)
            return
        } case 'fullReset': {
            scene.set(initialBattleState)
            return
        } case 'updateScreenSize': {
            const cursor = scene.select('allCharacters')
            for (const k of keys(cursor.get())) {
                const cu = cursor.select(k)
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
