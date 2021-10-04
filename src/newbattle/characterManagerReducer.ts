import produce from 'immer'
import { makeInitialPlayerCharacters } from './util/factories'

type Set<T> = T | ((old: T) => T)
export type Action =
    | { a: 'setIsPlayerTurn', v: boolean }
    | { a: 'setBattleHasBegun' }
    | { a: 'setHasMoved', id: string, v: boolean }
    | { a: 'setHealth', id: string, h: Set<number> }
    | { a: 'clearHasMoved' }
    | { a: 'setSelectedCharacter', c: CharacterMeta }
    | { a: 'setSelectedMove', m: MoveMeta }
    | { a: 'fullReset' }
    | { a: 'updateScreenSize', size: Size }


function reducer(state: State, action: Action) {
    // tl(`reducer received action ${JSON.stringify(action)}`)
    return produce(state, draft => {
        switch (action.a) {
            case 'setIsPlayerTurn': {
                // tl(`setting player turn to ${action.v}`)
                draft.isPlayerTurn = action.v
                return
            } case 'setBattleHasBegun': {
                draft.battleHasBegun = true
                return
            } case 'setHasMoved': {
                const c = draft.allCharacters.find(c => c.id === action.id)
                if (c == null) { console.error(`couldn't find character with id ${action.id}`); return }
                c.hasMoved = true
                return
            } case 'setHealth': {
                const c = draft.allCharacters.find(c => c.id === action.id)
                if (c == null) { console.error(`couldn't find character with id ${action.id}`); return }
                if (typeof action.h === 'function') {
                    c.health = action.h(c.health)
                } else {
                    c.health = action.h
                }
                return
            } case 'clearHasMoved': {
                draft.allCharacters.forEach(c => c.hasMoved = false)
                return
            } case 'setSelectedCharacter': {
                draft.selectedCharacter = action.c
                return
            } case 'setSelectedMove': {
                draft.selectedMove = action.m
                return
            } case 'fullReset': {
                const newState = makeInitialState()
                Object.assign(draft, newState)
                return
            } case 'updateScreenSize': {
                draft.allCharacters.forEach(c => {
                    c.screenX = c.x * action.size.width / 100
                    c.screenY = c.y * action.size.height / 100
                })
                return
            } default:
                throw new Error(`unknown action ${JSON.stringify(action)}`)
        }
    })
}

export type State = ReturnType<typeof makeInitialState>
function makeInitialState() {
    const allCharacters = makeInitialPlayerCharacters()
    const selectedCharacter = allCharacters.find(c => c.isPc)
    const selectedMove = selectedCharacter?.moves[0]
    if (selectedCharacter == null) throw Error('no player characters!')
    return Object.freeze({
        isPlayerTurn: Math.random() < .5,
        battleHasBegun: true,
        allCharacters,
        selectedCharacter,
        selectedMove,
    })
}
